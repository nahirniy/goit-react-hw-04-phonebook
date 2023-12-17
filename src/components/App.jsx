import { Component } from 'react';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ContactForm from './ContactForm/ContactForm';
import { ContactList } from './ContactList/ContactList';
import { Filter } from './Filter/Filter';
import { nanoid } from 'nanoid';

const LOCALSTORAGE_KEY = 'conctacts';

class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    this.setState({ contacts: JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) ?? [] });
  }

  componentDidUpdate(_, prevState) {
    console.log(prevState.contacts, this.state.contacts);
    if (prevState.contacts !== this.state.contacts) {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(this.state.contacts));
    }
  }

  addContact = newContact => {
    const { contacts } = this.state;

    const newName = newContact.name.toLowerCase();
    const isCheckedContact = contacts.find(({ name }) => name.toLowerCase() === newName);

    if (!isCheckedContact) {
      newContact.id = nanoid();

      this.setState({ contacts: [...this.state.contacts, newContact] });
    } else {
      Notify.failure(`${newContact.name} is already in contacts`);
    }
  };

  findContact = ({ target: { value } }) => {
    this.setState({ filter: value.toLowerCase() });
  };

  filteredConctact = () => {
    const { contacts, filter } = this.state;
    const suitableContacts = contacts.filter(({ name }) => name.toLowerCase().includes(filter));

    return filter === '' ? contacts : suitableContacts;
  };

  deleteContact = idDeleteContact => {
    this.setState({
      contacts: this.state.contacts.filter(({ id }) => id !== idDeleteContact),
    });
  };

  render() {
    const { addContact, findContact, deleteContact, filteredConctact } = this;

    return (
      <div className="container">
        <h1>Phonebook</h1>
        <ContactForm addContact={addContact} />
        <h2>Contacts</h2>
        <Filter findContact={findContact} />
        <ContactList filteredConctact={filteredConctact()} deleteContact={deleteContact} />
      </div>
    );
  }
}

export default App;
