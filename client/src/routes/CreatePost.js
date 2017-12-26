import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Form, Message, Button, Input, Container, Header } from 'semantic-ui-react';

class CreatePost extends Component {
  state = {
    content: '',
    contentError: ''
  }

  onSubmit = async () => {
    await this.setState({
      contentError: '',
    });

    if(this.state.content.length === 0) {
      this.setState({
        contentError: 'can not submit a blank post'
      });
    }

    if(this.state.contentError.length === 0) {
      const {content} = this.state;
      // stock_id will be separate for each stock page
      const stock_id = 1;
      
      let response;
      try {
        response = await this.props.mutate({
          variables: {content, stock_id}
        });
        console.log('response', response);
      } catch(err) {
        this.props.history.push('/login');
      }

    }
  }

  onChange = event => {
    // console.log(event.target);
    const {name, value} = event.target;
    this.setState({
      [name]: value
    });
  };

  render() {

    const {content, contentError} = this.state;

    const errorList = [];

    if(contentError) {
      errorList.push(contentError);
    }

    return (
      <Container text>

        <Header as='h2'>Create Post</Header>

        <Form>
          <Form.Field error={contentError.length > 0}>
            <Input 
              name='content' 
              onChange={this.onChange} 
              value={content} 
              placeholder='Content' 
              fluid 
            />
          </Form.Field>
        </Form>

        <Button onClick={this.onSubmit}>Submit</Button>

        {contentError ? <Message
          error
          header='There were some errors with your submission'
          list={errorList}
        /> : null}

      </Container>

    )
  }
};

const createPostMutation = gql`
  mutation($content: String!, $stock_id: Int!) {
    createPost(content: $content, stock_id: $stock_id)
  }
`;

export default graphql(createPostMutation)(CreatePost);
