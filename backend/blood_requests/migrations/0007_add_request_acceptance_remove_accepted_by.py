# Data migration: converts existing 'accepted' status records to 'partially_filled'
# and migrates accepted_by data into RequestAcceptance rows.
# This migration runs BEFORE the schema migration that removes accepted_by.

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


def migrate_accepted_data(apps, schema_editor):
    """
    For any BloodRequest with status='accepted' and accepted_by set,
    create a RequestAcceptance record and update status to 'partially_filled'.
    """
    BloodRequest = apps.get_model('requests', 'BloodRequest')
    RequestAcceptance = apps.get_model('requests', 'RequestAcceptance')

    for req in BloodRequest.objects.filter(status='accepted', accepted_by__isnull=False):
        RequestAcceptance.objects.get_or_create(
            blood_request=req,
            donor=req.accepted_by,
        )
        req.status = 'partially_filled'
        req.save(update_fields=['status'])


def reverse_migration(apps, schema_editor):
    """Reverse: move first acceptance back to accepted_by."""
    BloodRequest = apps.get_model('requests', 'BloodRequest')
    RequestAcceptance = apps.get_model('requests', 'RequestAcceptance')

    for acceptance in RequestAcceptance.objects.all():
        req = acceptance.blood_request
        req.accepted_by = acceptance.donor
        req.status = 'accepted'
        req.save(update_fields=['status', 'accepted_by'])


class Migration(migrations.Migration):

    dependencies = [
        ('requests', '0006_alter_bloodrequest_accepted_by'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        # 1. Create the RequestAcceptance table first
        migrations.CreateModel(
            name='RequestAcceptance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('accepted_at', models.DateTimeField(auto_now_add=True)),
                ('blood_request', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='acceptances',
                    to='requests.bloodrequest',
                )),
                ('donor', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='request_acceptances',
                    to=settings.AUTH_USER_MODEL,
                )),
            ],
            options={
                'ordering': ['-accepted_at'],
                'unique_together': {('blood_request', 'donor')},
            },
        ),
        # 2. Migrate existing accepted_by data into RequestAcceptance rows
        migrations.RunPython(migrate_accepted_data, reverse_migration),
        # 3. Remove the old accepted_by column (data is now in RequestAcceptance)
        migrations.RemoveField(
            model_name='bloodrequest',
            name='accepted_by',
        ),
        # 4. Update status choices (removes 'accepted', adds 'partially_filled')
        migrations.AlterField(
            model_name='bloodrequest',
            name='status',
            field=models.CharField(
                choices=[
                    ('pending', 'Pending'),
                    ('partially_filled', 'Partially Filled'),
                    ('completed', 'Completed'),
                ],
                default='pending',
                max_length=20,
            ),
        ),
    ]
