import { MailIcon } from '@heroicons/react/outline';
import { NextPage } from 'next';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Layout from '~/components/layout/Layout';
import Button from '~/components/ui/Button';
import TextArea from '~/components/ui/TextArea';
import TextInput from '~/components/ui/TextInput';
import { API } from '~/lib/api';

const Contact: NextPage = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.sendContactEmail(name, message, email);
      setSubmitted(true);
    } catch (err) {
      toast(
        'Oops! Something went wrong while trying to submit your message. Please try again.'
      );
    }
  };

  return (
    <Layout title="Contact | Snowball">
      <div className="max-w-xl p-6 mx-auto bg-white border rounded-md border-gray">
        <h1 className="mb-6 text-4xl font-bold text-center">Contact Us</h1>

        <p className="mb-6 leading-7 text-left text-darkgray">
          Snowball is built by a small team and we're always looking for feedback and
          suggestions. Please feel free to contact us and we'll get back to you ASAP!
        </p>

        <p className="flex items-center justify-center mb-6 font-semibold transition-colors text-md text-evergreen hover:text-darkgray">
          <MailIcon className="mr-1 w-7 h-7" />
          <a href="mailto:support@snowballtracker.io">support@snowballtracker.io</a>
        </p>

        {!submitted ? (
          <>
            <p className="pt-6 mb-3 text-center border-t text-darkgray border-lightgray">
              Or leave us a direct message:
            </p>

            <form autoComplete="off" onSubmit={onSubmit}>
              <TextInput
                name="name"
                type="text"
                placeholder="Your name"
                required
                className="mb-4"
                value={name}
                backgroundColor="#F9FAFF"
                onChange={(e) => setName(e.target.value)}
              />
              <TextInput
                name="email"
                type="email"
                placeholder="Your return email (optional)"
                className="mb-4"
                value={email}
                backgroundColor="#F9FAFF"
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextArea
                name="message"
                placeholder="Your message"
                className="mb-4"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              >
                Hie
              </TextArea>
              <Button type="submit">Submit</Button>
            </form>
          </>
        ) : (
          <p className="text-lg font-medium text-center text-darkgray">
            🎉 Message received. Thank you!
          </p>
        )}
      </div>
    </Layout>
  );
};

export default Contact;
