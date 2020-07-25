import os
from flask import Flask, request, render_template, jsonify
import markovify
# Support for gomix's 'front-end' and 'back-end' UI.
app = Flask(__name__, static_folder='public', template_folder='views')

# Set the app secret key from the secret environment variables.
app.secret = os.environ.get('SECRET')

# Dream database. Store dreams in memory for now. 
DREAMS = ['Python. Python, everywhere.']


@app.after_request
def apply_kr_hello(response):
    """Adds some headers to all responses."""
  
    # Made by Kenneth Reitz. 
    if 'MADE_BY' in os.environ:
        response.headers["X-Was-Here"] = os.environ.get('MADE_BY')
    
    # Powered by Flask. 
    response.headers["X-Powered-By"] = os.environ.get('POWERED_BY')
    return response


@app.route('/')
def homepage():
    """Displays the homepage."""
    return render_template('index.html')


  
with open("audre_lorde_excerpt.txt") as f:
    text = f.read()

# Build the model.
text_model = markovify.NewlineText(text)
    
# Print five randomly-generated sentences


sentence_group = []

for i in range(5):
    sentence = text_model.make_sentence()
    sentence_group.append(sentence)
    # print(sentence)
print("<3<3<3🌸🌸!!🌸💫")

sentence_glue = "\n".join(sentence_group)

print(sentence_glue)



#background process happening without any refreshing
@app.route('/background_process_test')
def background_process_test():
    print ("Hello!!!!!!!")
    return ("nothing")



if __name__ == '__main__':
    app.run()