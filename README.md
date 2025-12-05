# WIRACHAIN

An alternative to the project shown before on my thesis.

## TO-DO LIST:

- [ ] add sentry-sdk in stage (optional)
- [ ] add personalize cache to the backend (cache that support db replication)
- [ ] add csp in django (django-csp library)
- [ ] whitenoise library for static content????
- [ ] async endpoints????
- [ ] add django-health-check in stage
- [ ] add django_prometheus????
- [ ] remove migration of liht cities from server-entrypoint in production

- [ ] add refresh token logic in frontend
- [ ] fix github actions
- [ ] add custompermission for diferent types of enterprises
- [ ] use phone extension of the countries api in the frontend
- [ ] add a personalize exception handler in django-rest-framework
- [ ] check validate messages for drf message handler on ant response([link](https://ant.design/components/form?theme=light#validatemessages))

## NEXT PROJECT CONSIDERATIONS:

- [ ] next time setting roles use textchoices
- [ ] use personalize loggin
- [ ] add version api
- [ ] multiple data base architecture([link](https://freedium.cfd/https://medium.com/@yogeshkrishnanseeniraj/mastering-multiple-databases-in-django-a-complete-guide-to-configuration-and-best-practices-e5e6faba180d))
- [ ] use @api_view for total each line control

## QUESTIONS:

- [ ] does django logger ([handlers](https://docs.djangoproject.com/en/5.2/topics/logging/#handlers)) can send messages through web sockets to other services e.g. AWS cloud watch?

## REFERENCES

### AUTHENTICATION REFERENCES:

- https://django-rest-framework-simplejwt.readthedocs.io/en/latest/index.html
- https://dj-rest-auth.readthedocs.io/en/latest/index.html
- https://docs.allauth.org/en/latest/installation/quickstart.html
- https://medium.com/@fahimad/role-based-access-control-rbac-in-django-1955b31d93a5

### SECURITY REFERENCES:

- https://freedium.cfd/https://codepane.medium.com/%EF%B8%8F-11-django-security-mistakes-developers-still-make-in-2025-part-1-97e10a445d88

### AUDIT REFERENCES:

- https://medium.com/@mariliabontempo/django-audit-logging-the-best-libraries-for-tracking-model-changes-with-postgresql-2c7396564e97
- https://medium.com/@mahdikheireddine7/tracking-changes-in-django-with-django-auditlog-a-practical-guide-5bd2404b68b9

### PERFORMANCE REFERENCES:

- https://tarekeesa7.medium.com/optimal-performance-django-rest-framework-packages-1504963b94a4
- https://freedium.cfd/https://medium.com/@anas-issath/the-django-performance-optimization-playbook-098a95f7418e

### CACHE REFERENCES:

- https://django-cachalot.readthedocs.io/en/latest/index.html
- https://github.com/jazzband/django-redis
- https://dev.to/pragativerma18/django-caching-101-understanding-the-basics-and-beyond-49p

### MONITORING REFERENCES:

- https://django-debug-toolbar.readthedocs.io/en/latest/architecture.html
- https://medium.com/@simeon.emanuilov/guide-for-django-application-profiling-235fca3b8a6e
- https://medium.com/@adrialnathanael/mastering-django-application-monitoring-from-performance-metrics-to-error-tracking-dcd7787472e4

### QUALITY REFERENCES:

- https://www.freecodecamp.org/news/how-to-measure-django-code-quality-using-sonarqube-pytest-and-coverage/

### DEPLOYMENT:

- https://freedium.cfd/https://medium.com/@jinalpatel001212/how-to-configure-a-production-server-for-a-python-web-app-step-by-step-guide-f320c32e0e20

### FUTURE REFERENCES:

- https://smarttechie.co/audit-database-changes-with-debezium-a8c633226ce3
