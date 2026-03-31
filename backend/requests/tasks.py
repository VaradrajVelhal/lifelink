from celery import shared_task
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from donors.models import DonorProfile, OrganPledge
from requests.models import BloodRequest, OrganRequest
from donors.utils import haversine
import logging

logger = logging.getLogger(__name__)

@shared_task
def process_blood_request(request_id):
    try:
        blood_request = BloodRequest.objects.get(id=request_id)
        hospital_profile = blood_request.hospital.hospitalprofile
        lat_h = hospital_profile.latitude
        lon_h = hospital_profile.longitude

        if lat_h is None or lon_h is None:
            logger.warning(f"Hospital {hospital_profile.hospital_name} missing geolocation.")
            return

        # Find eligible donors
        donors = DonorProfile.objects.filter(
            blood_group=blood_request.blood_group,
            available=True
        )

        channel_layer = get_channel_layer()

        for donor in donors:
            if donor.latitude is not None and donor.longitude is not None:
                distance = haversine(lat_h, lon_h, donor.latitude, donor.longitude)
                if distance <= 15.0:  # 15km radius
                    # Trigger notification
                    message = f"Urgent: {blood_request.blood_group} needed at {hospital_profile.hospital_name} ({distance:.1f} km away)."
                    group_name = f"user_{donor.user.id}"
                    async_to_sync(channel_layer.group_send)(
                        group_name,
                        {
                            "type": "send_notification",
                            "message": message,
                            "notification_type": "urgent_blood"
                        }
                    )
    except Exception as e:
        logger.error(f"Error processing blood request {request_id}: {e}")

@shared_task
def process_organ_request(request_id):
    try:
        organ_request = OrganRequest.objects.get(id=request_id)
        hospital_profile = organ_request.hospital.hospitalprofile
        lat_h = hospital_profile.latitude
        lon_h = hospital_profile.longitude

        if lat_h is None or lon_h is None:
            logger.warning(f"Hospital {hospital_profile.hospital_name} missing geolocation.")
            return

        # Find donors who have pledged this organ
        pledges = OrganPledge.objects.filter(
            organ_type=organ_request.organ_type,
            is_active=True
        ).select_related('donor')

        channel_layer = get_channel_layer()

        for pledge in pledges:
            donor = pledge.donor
            if donor.latitude is not None and donor.longitude is not None:
                distance = haversine(lat_h, lon_h, donor.latitude, donor.longitude)
                if distance <= 15.0:  # 15km radius
                    message = f"Urgent Organ Request: {organ_request.organ_type} needed at {hospital_profile.hospital_name} ({distance:.1f} km away)."
                    group_name = f"user_{donor.user.id}"
                    async_to_sync(channel_layer.group_send)(
                        group_name,
                        {
                            "type": "send_notification",
                            "message": message,
                            "notification_type": "urgent_organ"
                        }
                    )
    except Exception as e:
        logger.error(f"Error processing organ request {request_id}: {e}")
