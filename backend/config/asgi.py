import os
from django.core.asgi import get_asgi_application
from .auto_superuser import ensure_superuser

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = get_asgi_application()
ensure_superuser()
