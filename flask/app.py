from flask import Flask, request
import json
import plotly.express as px

app = Flask(__name__)

@app.after_request
def after_request(r):
    r.headers['Access-Control-Allow-Origin'] = '*'
    return r
        
#####Test endpoint below#####
@app.route('/bar', methods=['GET'])
def bar():

    if request.method == 'GET':
        df = px.data.iris()
        fig = px.scatter(df, x="sepal_width",
                    y="sepal_length", color="species")
        return fig.to_json()

@app.route('/sankey', methods=['GET'])
def sankey():

    if request.method == 'GET':
        fig = go.Figure(data=[go.Sankey(
                node = dict(
                pad = 15,
                thickness = 20,
                line = dict(color = "black", width = 0.5),
                label = ["A1", "A2", "B1", "B2", "C1", "C2"],
                color = "blue"
                ),
                link = dict(
                source = [0, 1, 0, 2, 3, 3], # indices correspond to labels, eg A1, A2, A2, B1, ...
                target = [2, 3, 3, 4, 4, 5],
                value = [8, 4, 2, 8, 4, 2]
            ))])

        fig.update_layout(title_text="Hello Stemmons!m", font_size=10)
        return fig.to_json() 

@app.route('/line', methods=['GET'])
def line():

    if request.method == 'GET':
        df = px.data.gapminder()
        fig = px.line(df, x="year", y="lifeExp", color="continent", line_group="country", hover_name="country",
                line_shape="spline", render_mode="svg")
        
        return fig.to_json()

@app.route('/')
def index():
    return'''
    <head>
               <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
</head>
    <body>
    Hello World!
    <div id="tester" style="width:600px;height:250px;"></div>
    </body>
<script>
	TESTER = document.getElementById('tester');
	Plotly.newPlot( TESTER, [{
	x: [1, 2, 3, 4, 5],
	y: [1, 2, 4, 8, 16] }], {
	margin: { t: 0 } } );
</script>

    '''

if __name__ == '__main__':
    app.run(debug=True)