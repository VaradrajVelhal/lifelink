from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from .models import BloodRequest, RequestAcceptance

User = get_user_model()


class BloodRequestTests(TestCase):

    def setUp(self):
        self.client = APIClient()

        # Create Hospital
        self.hospital = User.objects.create_user(
            username="hospital1",
            email="hospital@test.com",
            password="Password123",
            role="hospital",
            phone="9999999999"
        )

        # Create Donor
        self.donor = User.objects.create_user(
            username="donor1",
            email="donor@test.com",
            password="Password123",
            role="donor",
            phone="8888888888"
        )

        # Blood request used in Accept/Complete tests
        self.blood_request = BloodRequest.objects.create(
            hospital=self.hospital,
            blood_group="A+",
            units=2,
            city="Pune",
            urgency="High",
            status="pending"
        )

    # -------------------------------------------------
    # Helper Method
    # -------------------------------------------------

    def authenticate(self, username, password):

        response = self.client.post(
            reverse("login"),
            {
                "username": username,
                "password": password
            },
            format="json"
        )

        access_token = response.data["access"]

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {access_token}"
        )

    # -------------------------------------------------
    # Create Blood Request Tests
    # -------------------------------------------------

    def test_hospital_can_create_request(self):

        self.authenticate(
            self.hospital.username,
            "Password123"
        )

        response = self.client.post(
            reverse("create-request"),
            {
                "blood_group": "B+",
                "units": 3,
                "city": "Mumbai",
                "urgency": "High"
            },
            format="json"
        )

        self.assertEqual(response.status_code, 201)

        self.assertEqual(BloodRequest.objects.count(), 2)

    def test_donor_cannot_create_request(self):

        self.authenticate(
            self.donor.username,
            "Password123"
        )

        response = self.client.post(
            reverse("create-request"),
            {
                "blood_group": "A+",
                "units": 2,
                "city": "Pune",
                "urgency": "High"
            },
            format="json"
        )

        self.assertEqual(response.status_code, 403)

        self.assertEqual(BloodRequest.objects.count(), 1)

    def test_anonymous_user_cannot_create_request(self):

        response = self.client.post(
            reverse("create-request"),
            {
                "blood_group": "A+",
                "units": 2,
                "city": "Pune",
                "urgency": "High"
            },
            format="json"
        )

        self.assertEqual(response.status_code, 401)

        self.assertEqual(BloodRequest.objects.count(), 1)

    def test_create_request_invalid_data(self):

        self.authenticate(
            self.hospital.username,
            "Password123"
        )

        response = self.client.post(
            reverse("create-request"),
            {
                "blood_group": "",
                "units": "",
                "city": "",
                "urgency": ""
            },
            format="json"
        )

        self.assertEqual(response.status_code, 400)

        self.assertEqual(BloodRequest.objects.count(), 1)

    # -------------------------------------------------
    # Accept Blood Request Tests
    # -------------------------------------------------

    def test_donor_can_accept_request(self):

        self.authenticate(
            self.donor.username,
            "Password123"
        )

        response = self.client.post(
            reverse(
                "accept-request",
                kwargs={"request_id": self.blood_request.id}
            )
        )

        self.assertEqual(response.status_code, 200)

        self.assertEqual(
            RequestAcceptance.objects.count(),
            1
        )

        self.blood_request.refresh_from_db()

        self.assertEqual(
            self.blood_request.status,
            "partially_filled"
        )

    def test_hospital_cannot_accept_request(self):

        self.authenticate(
            self.hospital.username,
            "Password123"
        )

        response = self.client.post(
            reverse(
                "accept-request",
                kwargs={"request_id": self.blood_request.id}
            )
        )

        self.assertEqual(response.status_code, 403)

        self.assertEqual(
            RequestAcceptance.objects.count(),
            0
        )

    def test_prevent_duplicate_acceptance(self):

        self.authenticate(
            self.donor.username,
            "Password123"
        )

        url = reverse(
            "accept-request",
            kwargs={"request_id": self.blood_request.id}
        )

        first_response = self.client.post(url)

        second_response = self.client.post(url)

        self.assertEqual(first_response.status_code, 200)

        self.assertEqual(second_response.status_code, 409)

        self.assertEqual(
            RequestAcceptance.objects.count(),
            1
        )

    def test_accept_non_existing_request(self):

        self.authenticate(
            self.donor.username,
            "Password123"
        )

        response = self.client.post(
            reverse(
                "accept-request",
                kwargs={"request_id": 9999}
            )
        )

        self.assertEqual(response.status_code, 404)

        self.assertEqual(
            RequestAcceptance.objects.count(),
            0
        )

    def test_cannot_accept_completed_request(self):

        self.blood_request.status = "completed"
        self.blood_request.save()

        self.authenticate(
            self.donor.username,
            "Password123"
        )

        response = self.client.post(
            reverse(
                "accept-request",
                kwargs={"request_id": self.blood_request.id}
            )
        )

        self.assertEqual(response.status_code, 409)

        self.assertEqual(
            RequestAcceptance.objects.count(),
            0
        )

    # -------------------------------------------------
    # Complete Blood Request Tests
    # -------------------------------------------------

    def test_hospital_can_complete_request(self):

        self.blood_request.status = "partially_filled"
        self.blood_request.save()

        self.authenticate(
            self.hospital.username,
            "Password123"
        )

        response = self.client.post(
            reverse(
                "complete-request",
                kwargs={"request_id": self.blood_request.id}
            )
        )

        self.assertEqual(response.status_code, 200)

        self.blood_request.refresh_from_db()

        self.assertEqual(
            self.blood_request.status,
            "completed"
        )

    def test_donor_cannot_complete_request(self):

        self.authenticate(
            self.donor.username,
            "Password123"
        )

        response = self.client.post(
            reverse(
                "complete-request",
                kwargs={"request_id": self.blood_request.id}
            )
        )

        self.assertEqual(response.status_code, 403)

    def test_cannot_complete_pending_request(self):

        self.authenticate(
            self.hospital.username,
            "Password123"
        )

        response = self.client.post(
            reverse(
                "complete-request",
                kwargs={"request_id": self.blood_request.id}
            )
        )

        self.assertEqual(response.status_code, 404)

        self.blood_request.refresh_from_db()

        self.assertEqual(
            self.blood_request.status,
            "pending"
        )