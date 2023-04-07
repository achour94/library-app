import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import { BookCheckoutPage } from './layouts/BookCheckoutPage/BookCheckoutPage';
import HomePage from './layouts/HomePage/HomePage';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { SearchBooksPage } from './layouts/SearchBooksPage/SearchBooksPage';

export const  App = () => {
  return (
    <div className='d-flex flex-column min-vh-100'>
      <Navbar />
      <div className='flex-grow-1'>
        <Switch>
          <Route exact path='/'>
            <Redirect to='/home' />
          </Route>
          <Route exact path='/home' component={HomePage} />
          <Route exact path='/search' component={SearchBooksPage} />
          <Route exact path='/checkout/:bookId' component={BookCheckoutPage} />
        </Switch>
      </div>
      <Footer/>
    </div>
  );
}
