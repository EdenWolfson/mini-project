import requests

BASE = "http://127.0.0.1:9000/"

# data = [{"likes": 78, "name": "Joe", "views": 10000},
#         {"likes": 10, "name": "How to make REST API", "views": 80000},
#         {"likes": 35, "name": "Tim", "views": 2000}]


# for i in range(len(data)):
# response = requests.put(BASE + "video/" + str(i), data[i])
# print(response.json())


# input()
# response = requests.delete(BASE + "video/0")
# print(response)
# input()
# response = requests.get(BASE + "video/2")
# print(response.json())

data = [{"name": "Eden", "email": "eden@bgu.ac.il", "favoriteProgrammingLanguage": "TypeScript"},
        {"name": "Shir", "email": "shir@bgu.ac.il",
            "favoriteProgrammingLanguage": "Python"},
        {"name": "Tslil", "email": "tslil@bgu.ac.il", "favoriteProgrammingLanguage": "NOOO"}]

# for i in range(len(data)):
#     input()
#     response = requests.post(BASE + "people/", data[i])
#     print(response)

# response = requests.post(
# BASE + "people/", {"name": "Eden", "email": "eden@bgu.ac.il", "favoriteProgrammingLanguage": "TypeScript"})


def return_json(url):
    response = requests.get(url)

    try:
        response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        return("Error: " + e.response.text)

    json_obj = response.json()
    return json_obj


print("post:")
response = requests.post(
    BASE + "people/", {"name": "Eden", "email": "eden@bgu.ac.il", "favoriteProgrammingLanguage": "TypeScript"})
print(response.json)

input()
print("get all:")
response = return_json(BASE + "people/")
print(response)

input()
print("get + id:")
response = return_json(BASE + "people/6adf0863-6eeb-4fd0-8c4a-3982ac50e365")
print(response)

input()
print("patch:")
response = requests.patch(
    BASE + "people/6adf0863-6eeb-4fd0-8c4a-3982ac50e365", {"email": "eden@post.bgu.ac.il"})
print(response.json())

input()
print("delete:")
response = requests.delete(
    BASE + "people/6adf0863-6eeb-4fd0-8c4a-3982ac50e365")
print(response)


input()
print("get all:")
response = return_json(BASE + "people/")
print(response)
