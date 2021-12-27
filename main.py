from flask import Flask, request, jsonify
from flask_restful import Api, Resource, reqparse, abort, fields, marshal_with
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin


import uuid

app = Flask(__name__)
api = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

db = SQLAlchemy(app)


class PeopleModel(db.Model):
    id = db.Column(db.String(100), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    activeTaskCount = db.Column(db.Integer, nullable=False)
    favoriteProgrammingLanguage = db.Column(db.String(100), nullable=False)

    def __init__(self, id, name, email, activeTaskCount, favoriteProgrammingLanguage):
        self.id = id
        self.name = name
        self.email = email
        self.activeTaskCount = activeTaskCount
        self.favoriteProgrammingLanguage = favoriteProgrammingLanguage


class TaskModel(db.Model):
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
db.create_all()


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


task_post_args = reqparse.RequestParser()
task_post_args.add_argument(
    "title", type=str, help="The title of the task is missing", required=True)
task_post_args.add_argument(
    "details", type=str, help="The details of the task are missing", required=True)
task_post_args.add_argument(
    "dueDate", type=str, help="The dueDate of the task is missing", required=True)
task_post_args.add_argument(
    "status", type=str, help="The status of the task is missing", required=True)


task_patch_args = reqparse.RequestParser()
task_patch_args.add_argument(
    "title", type=str, help="The title of the task is missing")
task_patch_args.add_argument(
    "details", type=str, help="The details of the task are missing")
task_patch_args.add_argument(
    "dueDate", type=str, help="The dueDate of the task is missing")
task_patch_args.add_argument(
    "status", type=str, help="The status of the task is missing")


task_status_put_args = reqparse.RequestParser()
task_status_put_args.add_argument(
    "status", type=str, help="The status of the task is missing", required=True)


task_owner_put_args = reqparse.RequestParser()
task_owner_put_args.add_argument(
    "ownerId", type=str, help="The status of the task is missing", required=True)


# Convert the person to JSON
def createJSONPerson(data):
    return {
        'name': data.name,
        'email': data.email,
        'favoriteProgrammingLanguage': data.favoriteProgrammingLanguage,
        'activeTaskCount': data.activeTaskCount,
        'id': data.id
    }


# Convert the task to JSON
def createJSONTask(data):
    return {
        'id': data.id,
        'title': data.title,
        'details': data.details,
        'dueDate': data.dueDate,
        'status': data.status,
        'ownerId': data.ownerId
    }


@app.route('/people/', methods=['POST', 'GET'])
@cross_origin()
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

        person = PeopleModel(id=new_id, name=args['name'], email=args['email'], activeTaskCount=0,
                             favoriteProgrammingLanguage=args['favoriteProgrammingLanguage'])
        db.session.add(person)
        db.session.commit()
        return 'Person created successfully', 201
    else:
        # if GET- Get a list of all people in the system.
        result = PeopleModel.query.all()
        list = []
        if result:
            for data in result:
                list.append(createJSONPerson(data))

        return jsonify(list)


@app.route('/people/<string:id>', methods=['PATCH', 'DELETE', 'GET'])
@cross_origin()
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

        return createJSONPerson(result)
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
@cross_origin()
def personTasks(id):
    if request.method == 'POST':
        # Add a new task to the person URL.
        args = task_post_args.parse_args()
        # TODO: check date
        # TODO: check if person with the id exists
        # TODO: check status
        new_id = str(uuid.uuid4())
        # make sure it is a new ID.
        while (TaskModel.query.filter_by(id=new_id).first()):
            new_id = str(uuid.uuid4())
        task = TaskModel(
            id=new_id, title=args['title'], details=args['details'], dueDate=args['dueDate'], status=args['status'], ownerId=id)
        db.session.add(task)
        db.session.commit()
        return 'Task created and assigned successfully', 201
    else:
        # Get an array of relevant tasks that belong to the person.
        result = TaskModel.query.filter_by(ownerId=id)
        list = []
        if result:
            for data in result:
                list.append(createJSONTask(data))
        return jsonify(list)


@app.route('/tasks/<string:id>', methods=['PATCH', 'DELETE', 'GET'])
@cross_origin()
def task(id):
    if request.method == 'PATCH':
        # Partial update of task details.
        args = task_patch_args.parse_args()
        # TODO: check date
        # TODO: check status
        result = TaskModel.query.filter_by(id=id).first()
        if not result:
            abort(404, message=f"A task with the id {id} does not exist.")

        if args['title']:
            result.title = args['title']
        if args['details']:
            result.details = args['details']
        if args['dueDate']:
            result.dueDate = args['dueDate']
        if args['status']:
            result.status = args['status']

        db.session.commit()

        return createJSONTask(result)
    elif request.method == 'DELETE':
        # Remove a task from the system.
        result = TaskModel.query.filter_by(id=id).first()
        if not result:
            abort(404, message=f"A task with the id {id} does not exist.")

        db.session.delete(result)
        db.session.commit()
        return 'Task removed successfully.', 200
    else:
        # Provide the details of the task whose id is provided.
        result = TaskModel.query.filter_by(id=id).first()
        if not result:
            abort(404, message=f"A task with the id {id} does not exist.")
        return createJSONTask(result)


@app.route('/tasks/<string:id>/status', methods=['PUT', 'GET'])
@cross_origin()
def taskStatus(id):
    if request.method == 'PUT':
        # TODO: Set a task's status.
        args = task_status_put_args.parse_args()
        result = TaskModel.query.filter_by(id=id).first()
        if not result:
            abort(404, message=f"A task with the id {id} does not exist.")
        result.status = args['status']

        db.session.commit()

        return "task's status updated successfully.", 204
    else:
        # Get the status of the task.
        result = TaskModel.query.filter_by(id=id).first()
        if not result:
            abort(404, message=f"A task with the id {id} does not exist.")
        return result.status, 200


@app.route('/tasks/<string:id>/owner', methods=['PUT', 'GET'])
@cross_origin()
def taskOwner(id):
    if request.method == 'PUT':
        # TODO: Set a task's owner.
        args = task_owner_put_args.parse_args()
        print("NOT IMPLEENTED YET")
        result = TaskModel.query.filter_by(id=id).first()
        if not result:
            abort(404, message=f"A task with the id {id} does not exist.")
        result.ownerId = args['ownerId']

        db.session.commit()

        return "task's status updated successfully.", 204
    else:
        # Get a task's owner id.
        result = TaskModel.query.filter_by(id=id).first()
        if not result:
            abort(404, message=f"A task with the id {id} does not exist.")
        return result.ownerId, 200


if __name__ == "__main__":
    app.run(port=8009, debug=True)
