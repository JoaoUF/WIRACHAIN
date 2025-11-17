from rest_framework.throttling import AnonRateThrottle


class AuthThrottle(AnonRateThrottle):
    scope = "auth"
    rate = "1/s"

    def parse_rate(self, rate):
        return (3, 1800)
