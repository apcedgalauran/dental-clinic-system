from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, ServiceViewSet, AppointmentViewSet, ToothChartViewSet,
    DentalRecordViewSet, DocumentViewSet, InventoryItemViewSet, BillingViewSet,
    ClinicLocationViewSet, TreatmentPlanViewSet, TeethImageViewSet,
    register, login, logout, current_user, analytics
)

router = DefaultRouter()
router.register('users', UserViewSet)
router.register('services', ServiceViewSet)
router.register('appointments', AppointmentViewSet)
router.register('tooth-charts', ToothChartViewSet)
router.register('dental-records', DentalRecordViewSet)
router.register('documents', DocumentViewSet)
router.register('inventory', InventoryItemViewSet)
router.register('billing', BillingViewSet)
router.register('locations', ClinicLocationViewSet)
router.register('treatment-plans', TreatmentPlanViewSet)
router.register('teeth-images', TeethImageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('me/', current_user, name='current_user'),
    path('profile/', current_user, name='profile'),  # Alias for /me/
    path('analytics/', analytics, name='analytics'),
]
