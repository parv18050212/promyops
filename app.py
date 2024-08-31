from flask import Flask, request, jsonify, send_from_directory
import openai
import os

app = Flask(__name__, static_folder='static', static_url_path='')

# Set your OpenAI API key
openai.api_key = "your-openai-api-key"

# Function to get a response from the ChatGPT API
def get_chatgpt_response(user_input):
    response = openai.Completion.create(
        engine="text-davinci-003",  # or use the latest GPT model
        prompt=f"User is feeling {user_input}. Provide natural solutions to help with this feeling.",
        max_tokens=150,
        n=1,
        stop=None,
        temperature=0.7,
    )
    return response.choices[0].text.strip()

@app.route("/chatbot", methods=["POST"])
def chatbot():
    user_input = request.json.get("feeling")
    if not user_input:
        return jsonify({"error": "Please provide the feeling you want to address."}), 400

    response = get_chatgpt_response(user_input)
    return jsonify({"response": response})

# Serve the frontend
@app.route('/', methods=['GET'])
def serve_frontend():
    return send_from_directory('static', 'index.html')

if __name__ == "__main__":
    app.run(debug=True)
