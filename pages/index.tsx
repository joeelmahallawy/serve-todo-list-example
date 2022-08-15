import {
  Box,
  Button,
  Center,
  createStyles,
  Input,
  Text,
  Title,
} from "@mantine/core";
import React, { useEffect, useState } from "react";

const useStyles = createStyles((theme) => ({
  deleteButton: {
    width: "25px",
    height: "25px",
    borderRadius: "100%",
    background: "red",
    color: "white",
    "&:hover": {
      cursor: "pointer",
      background: theme.colors.red[9],
    },
  },
}));

const IndexPage = () => {
  const { classes, theme } = useStyles();

  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState<{ id: string; task: string }[]>([]);

  useEffect(() => {
    // when we load our page
    (async () => {
      // get the todos from our DB
      const getTodos = await fetch(`/api/todos`, { method: "GET" });
      const data = await getTodos.json();
      // and initialize our todos so we can display them on page
      setTodos([...data]);
    })();
  }, []);

  return (
    <Center
      sx={(t) => ({
        flexDirection: "column",
        padding: 10,
        height: "100vh",
        justifyContent: "flex-start",
        // background: t.colors.gray[1],
      })}
    >
      <Title>Next.js + Serve todo app</Title>
      <Center style={{ gap: 5, marginTop: 10 }}>
        <Input.Wrapper label="New task">
          <Input
            onChange={(e) => setNewTodo(e.currentTarget.value)}
            style={{ width: "300px" }}
            placeholder="e.g. Send email to my boss"
          />
        </Input.Wrapper>
        <Button
          onClick={async () => {
            const randomID = Math.random().toString(36);
            // when we add, we send a POST request to our endpoint
            const upload = await fetch(`/api/todos`, {
              method: "POST",
              body: JSON.stringify({
                todo: newTodo,
                randomID,
              }),
            });
            const uploadSuccessful = await upload.json();
            console.log(uploadSuccessful);
            // prompt user in case of eror
            // if (!upload.ok) alert("Error adding todo");
            // add a new task with a random id and the newly added todo
            // else
            setTodos([...todos, { id: randomID, task: newTodo }]);
          }}
          mt="auto"
        >
          Create new todo
        </Button>
      </Center>

      <Box style={{ width: "30%" }}>
        <Title mt={10}>To-do list</Title>
        {todos.map((todo, i) => (
          <Center
            key={i}
            style={{
              padding: 10,
              marginTop: 10,
              borderRadius: 5,
              // color: "white",
              background: theme.colors.gray[2],
              justifyContent: "space-between",
            }}
          >
            <Text>{todo.task}</Text>
            <Center
              className={classes.deleteButton}
              onClick={async () => {
                const deleteTodo = await fetch(`/api/todos`, {
                  method: "DELETE",
                  body: JSON.stringify({ id: todo.id }),
                });
                // prompt user in case of error
                if (!deleteTodo.ok) alert("Could not delete todo");
                // keep every todo except the one we just deleted
                else setTodos(todos.filter((val) => val.id !== todo.id));
              }}
            >
              –
            </Center>
          </Center>
        ))}
      </Box>
    </Center>
  );
};

export default IndexPage;
