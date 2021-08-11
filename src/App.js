import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Button, Table, Form, FormGroup } from 'reactstrap';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      userId: '',
      title: '',
      body: '',
      posts: [],
      users: [],
      comments: []
    };
  }
  componentDidMount() {
    this.getPosts();
    this.getUsers();
  }

  //Create
  createPosts = async () => {
    const { data } = await axios.post(
      'https://jsonplaceholder.typicode.com/posts',
      {
        userId: this.state.userId,
        title: this.state.title,
        body: this.state.body
      }
    );
    const posts = [...this.state.posts];
    posts.push(data);
    this.setState({ posts, userId: '', title: '', body: '' });
  };

  //Update
  updatePost = async () => {
    const { data } = await axios.put(
      `${'https://jsonplaceholder.typicode.com/posts'}/${this.state.id}`, //apiurl/id template
      {
        userId: this.state.userId,
        title: this.state.title,
        body: this.state.body
      }
    );
    const posts = [...this.state.posts];
    const postIndex = posts.findIndex(post => post.id === this.state.id); //id findout
    posts[postIndex] = data;
    this.setState({ posts, userId: '', title: '', body: '', id: '' });
  };

  //Delete
  deletePost = async postId => {
    await axios.delete(
      `${'https://jsonplaceholder.typicode.com/posts'}/${postId}`
    );
    let posts = [...this.state.posts];
    posts = posts.filter(post => post.id !== postId);
    this.setState({ posts });
  };

  //Read
  getPosts = async () => {
    const { data } = await axios.get(
      'https://jsonplaceholder.typicode.com/posts'
    );
    this.setState({ posts: data });
  };
  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };
  handleSubmit = e => {
    e.preventDefault();
    if (this.state.id) {
      this.updatePost();
    } else {
      this.createPosts();
    }

    // this.setState({ userId: '', title: '', body: '', id: ' ' });
  };

  //Users Data
  getUsers = async () => {
    const { data } = await axios.get(
      'https://jsonplaceholder.typicode.com/users'
    );
    this.setState({ users: data });
  };
  //User Data select fucntion
  selectUsers = users => {
    this.setState({ userId: users });
  };

  //Comments
  getComments = async postid => {
    const { data } = await axios.get(
      'https://jsonplaceholder.typicode.com/posts/' + postid + '/comments'
    );
    this.setState({ comments: data });
  };

  //Post select function
  selectPost = post => {
    this.setState(post);
  };

  render() {
    return (
      <FormGroup>
        <h4>Blog Spot</h4>
        <Form onSubmit={this.handleSubmit}>
          {this.state.id && (
            <>
              <FormGroup>
                <label>Post ID : </label>
                <input
                  name="userId"
                  type="text"
                  value={this.state.userId}
                  onChange={this.handleChange}
                  disabled
                />
              </FormGroup>
              <br />
              <br />
            </>
          )}
          <div>
            <label>
              <strong>List of Name : </strong>
            </label>
            <br />
            <select size="10">
              {this.state.users.map(user => {
                return (
                  <option onClick={() => this.selectUsers(user.id)}>
                    {user.name}
                  </option>
                );
              })}
            </select>
          </div>
          <br />

          <FormGroup>
            <label>User ID : </label>
            <input
              name="userId"
              type="text"
              value={this.state.userId}
              onChange={this.handleChange}
            />
            <br />
            <br />
            <label>Title : </label>
            <input
              name="title"
              type="text"
              value={this.state.title}
              onChange={this.handleChange}
            />
            <br />
            <br />
            <label>Body : </label>
            <input
              name="body"
              type="text"
              value={this.state.body}
              onChange={this.handleChange}
            />
            <br />
            <br />
          </FormGroup>
          <FormGroup>
            <button type="submit">
              {this.state.id ? 'Update' : 'Add'} Post
            </button>
            <br />
            <br />
          </FormGroup>
        </Form>
        <Table bordered responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>title</th>
              <th>body</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map((post, index) => {
              return (
                <tr key={index}>
                  <td>{post.id}</td>
                  <td>{post.title}</td>
                  <td>
                    {post.body}
                    {this.state.comments.map(comment => {
                      if (comment.postId == post.id) {
                        return (
                          <table>
                            <tr>
                              <th>Comment</th>
                            </tr>
                            <tr>
                              <td>{comment.body}</td>
                            </tr>
                          </table>
                        );
                      }
                    })}
                  </td>
                  <td>
                    <Button
                      color="primary"
                      onClick={() => this.selectPost(post)}
                    >
                      Edit
                    </Button>
                  </td>
                  <td>
                    <Button
                      color="danger"
                      onClick={() => this.deletePost(post.id)}
                    >
                      Delete
                    </Button>
                  </td>
                  <td>
                    <Button
                      color="secondary"
                      onClick={() => this.getComments(post.id)}
                    >
                      Comment
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </FormGroup>
    );
  }
}
