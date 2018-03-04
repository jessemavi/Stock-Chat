import React from 'react';
import { Header, Button, Grid } from 'semantic-ui-react';

const Home = (props) => {
  return (
    <div className='homepage'>
      {/*
        Heads up! The styles below are necessary for the correct render of this example.
        You can do same with CSS, the main idea is that all the elements up to the `Grid`
        below must have a height of 100%.
      */}
      <style>{`
        body > div,
        body > div > div,
        body > div > div > div.homepage {
          height: 100%;
        }
      `}</style>
      <Grid
        textAlign='center'
        style={{ height: '100%' }}
        verticalAlign='middle'
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h1' color='green' textAlign='center'>
            {' '}Stock Chat
          </Header>
          <h3>
            Share ideas about your favorite stocks
            <br></br>
            Learn from other investors
          </h3>
          <Button 
            onClick={() => props.history.push('/signup')} 
            color='green' 
            fluid 
            size='large'
          >
          Sign Up
          </Button>
          <Button 
            onClick={() => props.history.push('/login')} 
            fluid 
            size='large'
            >
            Login
            </Button>
        </Grid.Column>
      </Grid>
    </div>
  )
}

export default Home;
