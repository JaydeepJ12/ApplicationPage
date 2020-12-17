try:
    from base import Engine, Base  # models.base
except:
    from models.base import Engine, Base
try:
    from .case_tables import *
except:
    from .case_tables import *


class AssocType(Base):
    __table__ = assoc_type
    __mapper_args__ = {
        'include_properties': ['ASSOC_TYPE_ID', 'NAME', 'IS_ACTIVE', 'CREATED_BY']
    }