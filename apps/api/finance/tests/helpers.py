def paginated_results(response):
    return response.json()["results"]


def paginated_count(response):
    return response.json()["count"]
