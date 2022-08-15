import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // we'll check the request method so we can choose what we want to do
    switch (req.method) {
      case "GET":
        // url for executing: SELECT * FROM todo
        const getTodos = await fetch(
          "https://api.withserve.com/v1/workflows/7cb831a8-2507-4e46-84d1-5bbc25419fb5?apiKey=9c2fb0d1-bbaf-4d78-a58d-2b590622cc6c",
          { method: req.method }
        );
        const todos = await getTodos.json();
        // turn it into JSON and return it
        res.json(todos.results);

      case "POST":
        const { todo: task, randomID } = JSON.parse(req.body);
        // url for executing: INSERT INTO todo(id,task) VALUES('{{id}}','{{task}}')
        const createTodo = await fetch(
          "https://api.withserve.com/v1/workflows/e919a348-bea9-4413-9a6a-53134f58e18f?apiKey=983b5369-1c82-4726-b368-2ca691b2705d",
          {
            // pass in dynamic body params 'id' and 'task'
            method: req.method,
            body: JSON.stringify({
              id: randomID,
              task,
            }),
          }
        );
        const create = await createTodo.json();
        res.json(create);

      case "DELETE":
        const { id } = JSON.parse(req.body);
        // url for executing: DELETE FROM todo WHERE id='{{id}}'
        const deleteTodo = await fetch(
          "https://api.withserve.com/v1/workflows/5222fbcc-c34c-4672-9f31-f4f093c5cea0?apiKey=6578bc95-ff72-4116-bb7c-6cf8c919a5a2",
          // pass in dynamic body parameter 'id'
          { method: req.method, body: JSON.stringify({ id }) }
        );
        const del = await deleteTodo.json();
        res.json(del);
      // only GET, POST, and DELETE requests are allowed
      default:
        // if different request method than above is passed, throw error
        throw new Error("Request method not supported");
    }
  } catch (error) {
    // in the case of an error catch it and return the message
    res.send({ error: error.message });
  }
};
export default handler;
