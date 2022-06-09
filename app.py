from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import pymongo as pm
from werkzeug.utils import secure_filename


app = Flask(__name__)

UPLOAD_FOLDER = '/Upload/uploads'
ALLOWED_EXTENSIONS = set(['csv', 'xls', 'xlsx'])
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
mongoDB = pm.MongoClient("mongodb://localhost:27017/")
db = mongoDB["objectDetection"]
collection = db["ObjectData"]
CORS(app, support_credentials=True)

def process(file):
    df = pd.read_csv("./"+file)
    x = collection.insert_many(df.to_dict('records'))
    return x

@app.route('/post', methods = ['GET', 'POST'])
def PostData():
    if(request.method == 'POST'):
        f = request.files['file']
        f.save(secure_filename(f.filename))
        ans = process(f.filename)
        
        return jsonify({"data":"File Uploaded"})

@app.route('/fetch', methods = ['GET', 'POST'])
def FetchData():
    if(request.method == 'POST'):
        data = request.get_json()
        startDate = data['startDate']
        endDate = data['endDate']
        ans = collection.find({"timestamp": {"$gte": startDate, "$lte": endDate}})
        res = []
        c_arr = []
        for i in ans:
            i.pop('_id')
            res.append(i)
            s = i['objects_detected'].split(',')
            for j in s:
                c_arr.append(j)
        df = pd.DataFrame(c_arr)
        count = df.value_counts().to_frame('count').reset_index()
        count.columns = ['threat', 'occurence']
        count.to_csv (r'./report.csv', index = False, header=True)
        return jsonify({"data": res})

if __name__ == '__main__':
    app.run(debug = True)   