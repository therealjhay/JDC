import os
from django.core.wsgi import get_wsgi_application
from .auto_superuser import ensure_superuser

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = get_wsgi_application()
ensure_superuser()
