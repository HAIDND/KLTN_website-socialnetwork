from flask import Flask, jsonify, request
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# Kết nối MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["my-social-network"]
locations_collection = db["locations"]

# Lấy dữ liệu từ MongoDB
locations = list(locations_collection.find())
# Tiền xử lý dữ liệu
descriptions = [loc["description"] for loc in locations]
custom_stop_words = ['của', 'và', 'là', 'theo', 'như', 'để', 'trong', 'có', 'một', 'này', 'với',
                     'nhưng', 'lại', 'thì', 'ra', 'nên', 'đã', 'được', 'rằng', 'nhất', 'ở', 'khi']

vectorizer = TfidfVectorizer(stop_words=custom_stop_words)
tfidf_matrix = vectorizer.fit_transform(descriptions)
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

# Hàm lấy top N gợi ý
def get_top_n_recommendations(index, n=5):
    sim_scores = list(enumerate(cosine_sim[index]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:n+1]
    indices = [i[0] for i in sim_scores]
    
    return indices

# API endpoint
@app.route('/recommend/<int:index>', methods=['GET'])
def recommend(index):
    if index < 0 or index >= len(locations):
        return jsonify({"error": "Invalid index"}), 400

    top_indices = get_top_n_recommendations(index)
    print(top_indices)
    recommendations = [{
        "id": locations[i]["id"],
        "_id": str(locations[i]["_id"]),  # chuyển _id thành chuỗi
        "name": locations[i]["name"],
        "location": locations[i]["location"],
        "rating": locations[i]["rating"],
        "description": locations[i]["description"],
        "imageUrl": locations[i]["imageUrl"]
    } for i in top_indices]

    return jsonify({
         "query_location": locations[index]["name"],
        "recommendations": recommendations
    })


if __name__ == '__main__':
    app.run(debug=True)