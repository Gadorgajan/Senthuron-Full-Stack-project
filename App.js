import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  Box,
  Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function App() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState({}); // Track completion per project

  const fetchProjects = () => {
    axios.get('http://localhost:5000/api/projects')
      .then(res => {
        setProjects(res.data);
        const completionStatus = {};
        res.data.forEach(p => {
          completionStatus[p.id] = false;
        });
        setCompleted(completionStatus);
      })
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

  const toggleCompleted = (id) => {
    setCompleted((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>🎬 Video Project Tracker</Typography>

      <Stack spacing={2} sx={{ mb: 3 }}>
        <TextField
          label="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />
        <TextField
          label="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={addProject}>Add Project</Button>
      </Stack>

      <List>
        {projects.map((project) => (
          <ListItem
            key={project.id}
            sx={{ bgcolor: '#f4f4f4', borderRadius: 1, mb: 1 }}
            secondaryAction={
              <Box>
                <Checkbox
                  checked={completed[project.id] || false}
                  onChange={() => toggleCompleted(project.id)}
                />
                <IconButton edge="end" onClick={() => deleteProject(project.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={
                <span style={{
                  textDecoration: completed[project.id] ? 'line-through' : 'none'
                }}>
                  {project.title}
                </span>
              }
              secondary={project.description}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default App;