import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getExerciseLibrary, createExercise, deleteExercise, updateExerciseVideo } from '../services/api';
import { Exercise } from '../types';
import styles from './ExerciseLibrary.module.css';
import ReactModal from 'react-modal';
import { PlusIcon, TrashIcon, VideoCameraIcon, LinkIcon } from '@heroicons/react/24/solid';

const ExerciseLibrary: React.FC = () => {
    const queryClient = useQueryClient();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [videoModalIsOpen, setVideoModalIsOpen] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    const [newExercise, setNewExercise] = useState<Partial<Exercise>>({
        name: '',
        description: '',
        instructions: '',
        category: 'general',
        difficulty_level: 'beginner',
        default_sets: 3,
        default_repetitions: 10,
        default_duration_seconds: 60,
    });

    const { data: exercises, isLoading, error } = useQuery<Exercise[]>({
        queryKey: ['exerciseLibrary'],
        queryFn: getExerciseLibrary,
    });

    const createExerciseMutation = useMutation({
        mutationFn: createExercise,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exerciseLibrary'] });
            setModalIsOpen(false);
        },
        onError: (err) => {
            console.error("Failed to create exercise:", err);
            alert('Failed to create exercise.');
        }
    });

    const deleteExerciseMutation = useMutation({
        mutationFn: deleteExercise,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exerciseLibrary'] });
        },
        onError: (err) => {
            console.error("Failed to delete exercise:", err);
            alert('Failed to delete exercise.');
        }
    });

    const updateVideoMutation = useMutation({
        mutationFn: updateExerciseVideo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exerciseLibrary'] });
            setVideoModalIsOpen(false);
        },
        onError: (err) => {
            console.error("Failed to update video:", err);
            alert('Failed to update video.');
        }
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewExercise(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createExerciseMutation.mutate(newExercise);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this exercise?')) {
            deleteExerciseMutation.mutate(id);
        }
    };

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && selectedExercise) {
            const formData = new FormData();
            formData.append('video', file);
            updateVideoMutation.mutate({ exerciseId: selectedExercise.id, video: formData });
        }
    };

    const handleYoutubeLink = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const youtubeLink = form.youtubeLink.value;
        if (youtubeLink && selectedExercise) {
            updateVideoMutation.mutate({ 
                exerciseId: selectedExercise.id, 
                youtubeLink: youtubeLink 
            });
        }
    };

    if (isLoading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>Error fetching exercises.</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>מאגר התרגילים</h1>
                <p className={styles.subtitle}>מאגר כל התרגילים הזמינים במערכת</p>
                <button className={styles.addButton} onClick={() => setModalIsOpen(true)}>
                    <PlusIcon />
                    צור תרגיל חדש
                </button>
            </div>

            <div className={styles.exerciseGrid}>
                {exercises?.map((exercise) => (
                    <div key={exercise.id} className={styles.exerciseCard}>
                        <div className={styles.cardHeader}>
                           <h3 className={styles.exerciseName}>{exercise.name}</h3>
                           <div className={styles.cardActions}>
                               <button 
                                   onClick={() => {
                                       setSelectedExercise(exercise);
                                       setVideoModalIsOpen(true);
                                   }} 
                                   className={styles.videoButton}
                                   title="הוסף סרטון הדגמה"
                               >
                                   <VideoCameraIcon />
                               </button>
                               <button 
                                   onClick={() => handleDelete(exercise.id)} 
                                   className={styles.deleteButton}
                                   title="מחק תרגיל"
                               >
                                   <TrashIcon />
                               </button>
                           </div>
                        </div>
                        <p className={styles.exerciseDescription}>{exercise.description}</p>
                        <div className={styles.exerciseDetails}>
                            <span className={styles.detailItem}>קטגוריה: {exercise.category}</span>
                            <span className={styles.detailItem}>רמת קושי: {exercise.difficulty_level}</span>
                        </div>
                        {exercise.video_url && (
                            <div className={styles.videoPreview}>
                                <video controls>
                                    <source src={exercise.video_url} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        )}
                        {exercise.youtube_link && (
                            <div className={styles.youtubeLink}>
                                <LinkIcon className={styles.linkIcon} />
                                <a href={exercise.youtube_link} target="_blank" rel="noopener noreferrer">
                                    צפה בסרטון ביוטיוב
                                </a>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <ReactModal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Create New Exercise"
                className={styles.modal}
                overlayClassName={styles.overlay}
                ariaHideApp={false}
            >
                <h2>צור תרגיל חדש</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input type="text" name="name" placeholder="שם התרגיל" onChange={handleInputChange} required />
                    <textarea name="description" placeholder="תיאור" onChange={handleInputChange}></textarea>
                    <textarea name="instructions" placeholder="הוראות" onChange={handleInputChange}></textarea>
                    <input type="text" name="category" placeholder="קטגוריה" onChange={handleInputChange} />
                    <select name="difficulty_level" onChange={handleInputChange}>
                        <option value="beginner">מתחיל</option>
                        <option value="intermediate">בינוני</option>
                        <option value="advanced">מתקדם</option>
                    </select>
                    <input type="number" name="default_sets" placeholder="סטים" onChange={handleInputChange} />
                    <input type="number" name="default_repetitions" placeholder="חזרות" onChange={handleInputChange} />
                    <input type="number" name="default_duration_seconds" placeholder="משך (שניות)" onChange={handleInputChange} />
                    <div className={styles.formActions}>
                        <button type="submit" className={styles.submitButton} disabled={createExerciseMutation.isPending}>
                            {createExerciseMutation.isPending ? 'יוצר...' : 'צור תרגיל'}
                        </button>
                        <button type="button" className={styles.cancelButton} onClick={() => setModalIsOpen(false)}>ביטול</button>
                    </div>
                </form>
            </ReactModal>

            <ReactModal
                isOpen={videoModalIsOpen}
                onRequestClose={() => setVideoModalIsOpen(false)}
                contentLabel="Add Exercise Video"
                className={styles.modal}
                overlayClassName={styles.overlay}
                ariaHideApp={false}
            >
                <h2>הוסף סרטון הדגמה</h2>
                <div className={styles.videoUploadSection}>
                    <h3>העלאת סרטון</h3>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className={styles.fileInput}
                    />
                    <p className={styles.uploadNote}>או</p>
                    <h3>קישור ליוטיוב</h3>
                    <form onSubmit={handleYoutubeLink} className={styles.youtubeForm}>
                        <input
                            type="url"
                            name="youtubeLink"
                            placeholder="הדבק קישור ליוטיוב"
                            required
                            className={styles.youtubeInput}
                        />
                        <button type="submit" className={styles.submitButton}>
                            שמור קישור
                        </button>
                    </form>
                </div>
                <button 
                    type="button" 
                    className={styles.cancelButton} 
                    onClick={() => setVideoModalIsOpen(false)}
                >
                    סגור
                </button>
            </ReactModal>
        </div>
    );
};

export default ExerciseLibrary;
