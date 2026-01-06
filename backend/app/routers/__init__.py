# This file makes the routers directory a Python package
from . import auth, profiles, products, recommendations, templates, wishlist

__all__ = ['auth', 'profiles', 'products', 'recommendations', 'templates', 'wishlist']