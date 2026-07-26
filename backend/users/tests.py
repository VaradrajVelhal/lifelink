from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()


class AuthenticationTests(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            username="varad",
            email="varad@test.com",
            password="Password123",
            role="donor",
            phone="9876543210"
        )

    # ---------------------------------------
    # Helper Method
    # ---------------------------------------

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

    # ---------------------------------------
    # Registration Tests
    # ---------------------------------------

    def test_user_can_register(self):

        response = self.client.post(
            reverse("register"),
            {
                "username": "john",
                "email": "john@test.com",
                "password": "Password123",
                "role": "donor",
                "phone": "9999999999"
            },
            format="json"
        )

        self.assertEqual(response.status_code, 201)

        self.assertTrue(
            User.objects.filter(username="john").exists()
        )

    def test_registration_requires_email(self):

        response = self.client.post(
            reverse("register"),
            {
                "username": "john",
                "password": "Password123",
                "role": "donor",
                "phone": "9999999999"
            },
            format="json"
        )

        self.assertEqual(response.status_code, 400)

        self.assertFalse(
            User.objects.filter(username="john").exists()
        )

    # ---------------------------------------
    # Login Tests
    # ---------------------------------------

    def test_user_can_login(self):

        response = self.client.post(
            reverse("login"),
            {
                "username": "varad",
                "password": "Password123"
            },
            format="json"
        )

        self.assertEqual(response.status_code, 200)

        self.assertIn("access", response.data)

        self.assertIn("refresh", response.data)

    def test_login_invalid_password(self):

        response = self.client.post(
            reverse("login"),
            {
                "username": "varad",
                "password": "WrongPassword"
            },
            format="json"
        )

        self.assertEqual(response.status_code, 401)

        self.assertNotIn("access", response.data)

        self.assertNotIn("refresh", response.data)

    # ---------------------------------------
    # User Info Tests (/me)
    # ---------------------------------------

    def test_authenticated_user_can_access_profile(self):

        self.authenticate(
            "varad",
            "Password123"
        )

        response = self.client.get(
            reverse("user-info")
        )

        self.assertEqual(response.status_code, 200)

        self.assertEqual(
            response.data["username"],
            "varad"
        )

        self.assertEqual(
            response.data["role"],
            "donor"
        )

    def test_unauthenticated_user_cannot_access_profile(self):

        response = self.client.get(
            reverse("user-info")
        )

        self.assertEqual(response.status_code, 401)

    # ---------------------------------------
    # Logout Tests
    # ---------------------------------------

    def test_authenticated_user_can_logout(self):

        self.authenticate(
            "varad",
            "Password123"
        )

        response = self.client.post(
            reverse("logout")
        )

        self.assertEqual(response.status_code, 200)

        self.assertEqual(
            response.data["message"],
            "Successfully logged out"
        )

    def test_unauthenticated_user_cannot_logout(self):

        response = self.client.post(
            reverse("logout")
        )

        self.assertEqual(response.status_code, 401)