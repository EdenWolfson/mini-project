from os import name, stat
from flask import Flask, request, jsonify
from flask_restful import Api, Resource, reqparse, abort, fields, marshal_with
from flask_sqlalchemy import SQLAlchemy


import uuid

app = Flask(__name__)
api = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class PeopleModel(db.Model):
    id = db.Column(db.String(100), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    favoriteProgrammingLanguage = db.Column(db.String(100), nullable=False)

    def __init__(self, id, name, email, favoriteProgrammingLanguage):
        self.id = id
        self.name = name
        self.email = email
        self.favoriteProgrammingLanguage = favoriteProgrammingLanguage


class TaskModel(db.model):
    id = db.Column(db.String(100), primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    details = db.Column(db.String(100), nullable=False)
    dueDate = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(100), nullable=False)
    ownerId = db.Column(db.String(100), nullable=False)

    def __init__(self, id, title, details, dueDate, status, ownerId):
        self.id = id
        self.title = title
        self.details = details
        self.dueDate = dueDate
        self.status = status
        self.ownerId = ownerId


# creating the DB- this should happen only once!
# db.create_all()


person_post_args = reqparse.RequestParser()
person_post_args.add_argument(
    "name", type=str, help="The name of the person is missing", required=True)
person_post_args.add_argument(
    "email", type=str, help="The email of the person is missing", required=True)
person_post_args.add_argument(
    "favoriteProgrammingLanguage", type=str, help="The favoriteProgrammingLanguage of the person is missing", required=True)


person_patch_args = reqparse.RequestParser()
person_patch_args.add_argument(
    "name", type=str, help="The name of the person is missing")
person_patch_args.add_argument(
    "email", type=str, help="The email of the person is missing")
person_patch_args.add_argument(
    "favoriteProgrammingLanguage", type=str, help="The favoriteProgrammingLanguage of the person is missing")


# convert the person to JSON
def createJSONPerson(data):
    return {
        'id': data.id,
        'name': data.name,
        'email': data.email,
        'favoriteProgrammingLanguage': data.favoriteProgrammingLanguage}


def createPatchPersonResponse(data):
    return {
        'name': data.name,
        'email': data.email,
        'favoriteProgrammingLanguage': data.favoriteProgrammingLanguage,
        "activeTaskCount": 0,  # TODO: change
        'id': data.id
    }


@app.route('/people/', methods=['POST', 'GET'])
def postOrGetAllPeople():
    if request.method == 'POST':
        # if POST- Add a new person to the system.
        args = person_post_args.parse_args()
        if PeopleModel.query.filter_by(email=args['email']).first():
            abort(
                400, message=f"A person with email '{email}' already exists.")
        new_id = str(uuid.uuid4())
        # make sure it is a new ID.
        while (PeopleModel.query.filter_by(id=new_id).first()):
            new_id = str(uuid.uuid4())

        person = PeopleModel(id=new_id, name=args['name'], email=args['email'],
                             favoriteProgrammingLanguage=args['favoriteProgrammingLanguage'])
        db.session.add(person)
        db.session.commit()
        return 'Person created successfully', 201
    else:
        # if GET- Get a list of all people in the system.
        result = PeopleModel.query.all()
        if not result:
            abort(404, message="Could not find people")
        list = []
        for data in result:
            list.append(createJSONPerson(data))

        return jsonify(list)


@app.route('/people/<string:id>', methods=['PATCH', 'DELETE', 'GET'])
def getPerson(id):
    if request.method == 'PATCH':
        # if PATCH- update person details.
        args = person_patch_args.parse_args()
        result = PeopleModel.query.filter_by(id=id).first()
        if not result:
            abort(404, message=f"A person with the id {id} does not exist.")

        if args['name']:
            result.name = args['name']
        if args['email']:
            result.email = args['email']
        if args['favoriteProgrammingLanguage']:
            result.favoriteProgrammingLanguage = args['favoriteProgrammingLanguage']

        db.session.commit()

        return createPatchPersonResponse(result)
    elif request.method == 'DELETE':
        # if DELETE- Remove the person whose id is provided fron the system.
        result = PeopleModel.query.filter_by(id=id).first()
        if not result:
            abort(404, message=f"A person with the id {id} does not exist.")

        db.session.delete(result)
        db.session.commit()
        return 'Person removed successfully.', 200
    else:
        # if GET- Get a detailed description of the person whose id is provided.
        result = PeopleModel.query.filter_by(id=id).first()
        if not result:
            abort(404, message=f"A person with the id {id} does not exist.")
        return createJSONPerson(result)


@app.route('/people/<string:id>/tasks/', methods=['POST', 'GET'])
def personTasks():
    if request.method == 'POST':
        # TODO: Add a new task to the person URL.
        print("NOT IMPLEENTED YET")
    else:
        # TODO: Get an array of relevant tasks that belong to the person.
        print("NOT IMPLEENTED YET")


@app.route('/tasks/<string:id>', methods=['PATCH', 'DELETE', 'GET'])
def task():
    if request.method == 'PATCH':
        # TODO: Partial update of task details.
        print("NOT IMPLEENTED YET")
    elif request.method == 'DELETE':
        # TODO: Remove a task from the system.
        print("NOT IMPLEENTED YET")
    else:
        # TODO: Provide the details of the task whose id is provided.
        print("NOT IMPLEENTED YET")


@app.route('/tasks/<string:id>/status', methods=['PUT', 'GET'])
def taskStatus():
    if request.method == 'PUT':
        # TODO: Set a task's status.
        print("NOT IMPLEENTED YET")
    else:
        # TODO: Get the status of the task.
        print("NOT IMPLEENTED YET")


@app.route('/tasks/<string:id>/owner', methods=['PUT', 'GET'])
def taskOwner():
    if request.method == 'PUT':
        # TODO: Set a task's owner.
        print("NOT IMPLEENTED YET")
    else:
        # TODO: Get a task's owner id.
        print("NOT IMPLEENTED YET")


if __name__ == "__main__":
    app.run(port=9000, debug=True)
