import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, List, ListItem } from '@mui/material';

const StudentPage = () => {
    const [student, setStudent] = useState(null);
    const [newStudent, setNewStudent] = useState({
        id: 0,
        name: '',
        workScope: 0,
        completionDate: '',
        busyDays: []
    });

    useEffect(() => {
        fetchStudent();
    }, []);

    const fetchStudent = () => {
        axios.get(`/schedule/${newStudent.id}`)
            .then(response => {
                setStudent(response.data);
            })
            .catch(error => {
                console.error('Error fetching student:', error);
            });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewStudent(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddBusyDay = () => {
        setNewStudent(prevState => ({
            ...prevState,
            busyDays: [...prevState.busyDays, { date: '', busyHours: 0 }]
        }));
    };

    const handleBusyDayChange = (index, event) => {
        const { name, value } = event.target;
        setNewStudent(prevState => {
            const busyDays = [...prevState.busyDays];
            busyDays[index][name] = value;
            return { ...prevState, busyDays };
        });
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post(`/schedule`, newStudent)
            .then(response => {
                const savedStudentId = response.data.id;
                fetchStudent(savedStudentId);
                setNewStudent({
                    id: 0,
                    name: '',
                    workScope: 0,
                    completionDate: '',
                    busyDays: []
                });
            })
            .catch(error => {
                console.error('Error creating schedule:', error);
            });
    };

    return (
        <div>
            <Typography variant="h2" sx={{ marginTop: '0.5cm' }}>Schedule Counter</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    name="name"
                    value={newStudent.name}
                    onChange={handleInputChange}
                    sx={{ marginTop: '1cm' }}
                />
                <br />
                <TextField
                    type="number"
                    label="Work Scope"
                    name="workScope"
                    value={newStudent.workScope}
                    onChange={handleInputChange}
                    sx={{ marginTop: '0.5cm' }}
                />
                <br />
                <TextField
                    type="date"
                    label="Completion Date"
                    name="completionDate"
                    value={newStudent.completionDate}
                    onChange={handleInputChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        pattern: '\\d{4}-\\d{2}-\\d{2}',
                    }}
                    sx={{ marginTop: '0.5cm' }}
                />
                <br />
                <Typography variant="h5" sx={{ marginTop: '0.5cm' }}>Busy Days:</Typography>
                {newStudent.busyDays.map((day, index) => (
                    <div key={index} >
                        <TextField
                            label="Date"
                            type="date"
                            value={day.date}
                            onChange={(event) => handleBusyDayChange(index, event)}
                            name="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                pattern: '\\d{4}-\\d{2}-\\d{2}',
                            }}
                            sx={{ marginTop: '0.5cm' }}
                        />
                        <TextField
                            label="Busy Hours"
                            type="number"
                            value={day.busyHours}
                            onChange={(event) => handleBusyDayChange(index, event)}
                            name="busyHours"
                            sx={{ marginTop: '0.5cm' }}
                        />
                    </div>
                ))}
                <Button variant="outlined" onClick={handleAddBusyDay} sx={{ marginTop: '0.5cm' }}>Add Busy Day</Button>
                <br />
                <Button type="submit" variant="contained" sx={{ marginTop: '0.5cm' }}>Create Schedule</Button>
            </form>
            <Typography variant="h3" sx={{ marginTop: '1cm' }}>Schedule:</Typography>
            <List>
                {student && (
                    <ListItem key={student.id}>
                        <Typography variant="h6">{student.name}</Typography>
                        <Typography>Work Scope: {student.workScope}</Typography>
                        <Typography>Completion Date: {student.completionDate}</Typography>
                        <Typography variant="h6">Working Times:</Typography>
                        <List>
                            {student.workingTimes.map((workingTime, index) => (
                                <ListItem key={index}>
                                    Date: {workingTime.date}, Hours: {workingTime.hours}
                                </ListItem>
                            ))}
                        </List>
                    </ListItem>
                )}
            </List>
        </div>)
}

export default StudentPage;