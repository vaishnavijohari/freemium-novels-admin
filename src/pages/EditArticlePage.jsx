import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useArticles } from '../contexts/ArticleContext.jsx';

const EditArticlePage = () => {
  const navigate = useNavigate();
  const { articleId } = useParams();
  const { articles, updateArticle } = useArticles();

  // State for form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [currentArticle, setCurrentArticle] = useState(null);
  
  // State for image preview and validation
  const [coverPreview, setCoverPreview] = useState(null);
  const [fileError, setFileError] = useState('');

  // Effect to load article data into state
  useEffect(() => {
    const article = articles.find(a => a.id === parseInt(articleId));
    if (article) {
      setCurrentArticle(article);
      setTitle(article.title);
      setCategory(article.category);
      setContent(article.content);
    }
  }, [articleId, articles]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setCoverPreview(null);
      setFileError('');
      return;
    }

    if (file.size > 300 * 1024) {
      setFileError('File is too large. Maximum size is 300KB.');
      setCoverPreview(null);
      event.target.value = null;
      return;
    }

    setFileError('');
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    if (!title || !currentArticle) return;
    const updatedArticle = {
      ...currentArticle,
      title,
      category,
      content,
      lastUpdated: new Date().toISOString().slice(0, 10),
    };
    updateArticle(updatedArticle);
    navigate('/articles');
  };
  
  if (!currentArticle) {
    return <Typography>Loading article...</Typography>
  }

  return (
    <Box>
       <style>{`
        .ck-editor__editable_inline { min-height: 250px; background: #2D323C !important; color: #FFFFFF !important; border-color: rgba(255, 255, 255, 0.2) !important; }
        .ck.ck-toolbar { background: #1E2128 !important; border-color: rgba(255, 255, 255, 0.2) !important; }
        .ck.ck-button, .ck.ck-button.ck-on { color: #FFFFFF !important; }
        .ck.ck-button:hover, .ck.ck-button.ck-on:hover { background: #2D323C !important; }
      `}</style>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/articles')} sx={{ mb: 2 }}>
        Back to Articles
      </Button>
      <Typography variant="h4" sx={{ mb: 3 }}>Edit Article</Typography>

      <Paper sx={{ p: 4, width: '100%' }}>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField label="Article Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth required />
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
                <MenuItem value="Finance & Crypto">Finance & Crypto</MenuItem>
                <MenuItem value="Entertainment">Entertainment</MenuItem>
                <MenuItem value="Sports">Sports</MenuItem>
              </Select>
            </FormControl>
            <Button component="label" variant="outlined">
                Upload Cover Image
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
          </Box>
           {fileError && <Typography color="error" variant="caption" sx={{mt: -2}}>{fileError}</Typography>}
           {coverPreview && (
                <Box sx={{ mt: -1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Image Preview:</Typography>
                    <Box 
                        component="img"
                        src={coverPreview}
                        alt="Cover preview"
                        sx={{
                            width: '150px',
                            height: 'auto',
                            borderRadius: '8px',
                            border: '1px solid',
                            borderColor: 'divider'
                        }}
                    />
                </Box>
            )}
          <Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>Article Content</Typography>
            <CKEditor
                editor={ ClassicEditor }
                data={content}
                onChange={(event, editor) => setContent(editor.getData())}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
            <Button variant="text" onClick={() => navigate('/articles')}>Cancel</Button>
            <Button variant="contained" size="large" onClick={handleSave}>Save Changes</Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditArticlePage;