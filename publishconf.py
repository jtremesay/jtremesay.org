# This file is only used if you use `make publish` or
# explicitly specify it as your config file.

import os
import sys

sys.path.append(os.curdir)
from pelicanconf import *

# If your site is available via HTTPS, make sure SITEURL begins with https://
SITEURL = "https://jtremesay.org"
RELATIVE_URLS = False

FEED_ALL_ATOM = "atom.xml"

DELETE_OUTPUT_DIRECTORY = False

# Following items are often useful when publishing

# DISQUS_SITENAME = ""
# GOOGLE_ANALYTICS = ""