import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { preview } from '../assets'
import { getRandomPrompt } from '../utils'

import { FormField, Loader } from '../components'

const CreatePost = () => {

  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: ''
  });

  const [generatingIMG, setGeneratingIMG] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...form }),
        });

        await response.json();
        alert('Success');
        navigate('/');
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please generate an image with proper details');
    }
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  }
  const generateImg = async () => {
    if (form.prompt) {
      try {
        setGeneratingIMG(true);
        const response = await fetch('http://localhost:8080/api/v1/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prompt: form.prompt,
          }),
        });

        const data = await response.json();
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` })
      } catch (error) {
        alert(error);
      } finally {
        setGeneratingIMG(false);
      }
    }
    else {
      alert('Please enter a prompt');
    }
  }

  return (
    <section className='maw-w-7xl mx-auto'>
      <div>
        <h1 className=' font-extrabold text-[#222328] text-[32px] '>Create Post</h1>
        <p className=' mt-2 text-[#666e75] text-[16px] max-w-[500px]'>Create visually stunning and imaginative collections of images and share them with community.</p>
      </div>
      <form className='mt-8 max-w-3xl' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-5'>
          <FormField
            LabelName="Your Name"
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            handleChange={handleChange}
          />
          <FormField
            LabelName="Prompt"
            type="text"
            name="prompt"
            placeholder="A Samurai riding a Horse on Mars, lomography."
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
          <div className='relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center'>
            {form.photo ? (
              <img src={form.photo}
                className='w-full h-full object-contain'
              />
            ) : (
              <img
                src={preview}
                className='w-9/12 h-9/12 object-contain opacity-40'
              />
            )}
            {generatingIMG && (
              <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                <Loader />
              </div>
            )}

          </div>
        </div>
        <div className='mt-5 flex gap-5'>
          <button
            type='button'
            onClick={generateImg}
            className='text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center '
          >
            {generatingIMG ? 'Generating...' : 'Generate'}
          </button>
        </div>
        <div className='mt-4'>
          <p className='mt-1 text-[#666e75] text-[14px] '>
            Once you have created the image you want, you can share it to community.</p>
          <button
            type='submit'
            className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
          >
            {loading ? 'Sharing...' : 'Share with community'}
          </button>
        </div>

      </form>

    </section>
  )
}

export default CreatePost
