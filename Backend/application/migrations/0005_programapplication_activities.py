# Generated by Django 3.2.7 on 2021-11-11 17:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('application', '0004_alter_applicationactivity_application'),
    ]

    operations = [
        migrations.AddField(
            model_name='programapplication',
            name='activities',
            field=models.ManyToManyField(through='application.ApplicationActivity', to='application.Activity'),
        ),
    ]
