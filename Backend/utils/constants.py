from django.utils.translation import ugettext_lazy as _

PROGRAM_STATUSES = {
    'upcoming': 'upcoming',
    'self': 'self',
    'current': 'current',
    'finished': 'finished',
    'hidden': 'hidden'
}

TIMEZONES = [
    ('Africa/Algiers', _('Algeria')),
    ('Asia/Amman', _('Amman/Jordan')),
    ('Asia/Beirut', _('Beirut/Lebanon')),
    ('Asia/Baghdad', _('Baghdad/Iraq')),
    ('Asia/Qatar', _('Bahrain and Qatar')),
    ('Africa/Cairo', _('Cairo/Egypt')),
    ('Asia/Dubai', _('Dubai/UAE')),
    ('Asia/Riyadh', _('Riyadh/KSA')),
]

STATE_CHOICES = [
    ("in_progress", "in_progress"),
    ("pending_review", "pending_review"),
    ("accepted", "accepted"),
    ("rejected", "rejected"),
    ("on_hold", "on_hold"),
    ("action_required", "action_required"),
]