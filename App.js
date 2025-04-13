import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Typography, TextField, Button, List, ListItem, ListItemText, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function App() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchProjects = () => {
    axios.get('http://localhost:5000/api/projects')
      .then(res => setProjects(res.data))
      .catch(err => console.error(err));
  };

  const addProject = () => {
    if (!title || !description) return;
    axios.post('http://localhost:5000/api/projects', { title, description })
      .then(() => {
        setTitle('');
        setDescription('');
        fetchProjects();
      });
  };

  const deleteProject = (id) => {
    axios.delete(`http://localhost:5000/api/projects/${id}`)
      .then(() => fetchProjects());
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>🎬 Video Project Tracker</Typography>

      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" onClick={addProject}>Add Project</Button>

      <List>
        {projects.map((project) => (
          <ListItem key={project.id}
            secondaryAction={
              <IconButton onClick={() => deleteProject(project.id)}>
                <DeleteIcon />
              </IconButton>
            }>
            <ListItemText
              primary={project.title}
              secondary={project.description}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default App;