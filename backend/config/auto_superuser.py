import os


def ensure_superuser():
    """
    Create a Django superuser once, using env vars, if none exists.
    Intended for hosted environments without shell access.
    """
    username = os.getenv("DJANGO_SUPERUSER_USERNAME")
    password = os.getenv("DJANGO_SUPERUSER_PASSWORD")
    email = os.getenv("DJANGO_SUPERUSER_EMAIL", "")

    if not username or not password:
        return

    try:
        from django.contrib.auth import get_user_model
        User = get_user_model()

        if User.objects.filter(is_superuser=True).exists():
            return

        User.objects.create_superuser(
            username=username,
            email=email,
            password=password,
        )
        print("Auto-created Django superuser.")
    except Exception as exc:
        print(f"Auto-superuser creation skipped: {exc}")
