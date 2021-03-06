import React from 'react';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
import { createLike, deleteLike } from '../../actions/like_actions';
import { fetchPost } from '../../actions/post_actions';
import { createComment, deleteComment } from '../../actions/comment_actions';
import { openCommentDropdown, closeCommentDropdown } from '../../actions/modal_actions';

export class PostItem extends React.Component {
  constructor(props){
    super(props);
    this.state={
      commentValue: '',
      commentId: null,
      length: '200px',
      placeholder: '  want to say something?',
    };
    this.props.remove_error();
  }

  handleAuthorClick(){
    this.props.history.push(`/homepage/${this.props.user.username}/${this.props.user.id}`);
  }

  onFocus(){
    this.setState({
      length: '300px',
      placeholder: ''
    });
  }

  onBlur(){
    this.setState({
      length: '200px',
      placeholder: '  want to say something?'
    });
  }

  handleLike(){
    if(this.props.liked){
      this.props.deleteLike(this.props.post.id);
    }
    else{
      this.props.createLike(this.props.post.id);
    }
  }

  handleCommentImg(post){
    document.getElementsByClassName(`comment-input-bar-${this.props.post.id}`)[0].focus();
  }

  updateComment(e){
    this.setState({
      commentValue: e.target.value
    });
  }

  handleComment(id){
    this.setState({
      commentId: id
    });
    this.props.openCommentDropdown();
  }

  handleCancelComment(){
    this.props.closeCommentDropdown();
  }

  handleDeleteComment(id){
    this.props.deleteComment(id);
    this.setState({
      commentId: null
    });
  }

  handleSubmitComment(e){
    e.preventDefault();
    this.props.createComment({post_id: this.props.post.id, body: this.state.commentValue});
    this.setState({
      commentValue: ''
    });
  }

  render(){
    const users = this.props.users;
    const deleteable = this.props.deleteable;
    const currentUser = this.props.currentUser;
    const status = this.props.status;
    const comment_id = this.state.commentId;
    const items = this.props.comments.map((comment, idx) => {
      const author = users[comment.author_id];
      const deleteable_status = status && (comment.id === comment_id) ? "" : 'hidden';
      return (
        <ul key={idx} onMouseLeave={this.handleCancelComment.bind(this)}>
          <li key={comment.id} onMouseOver={()=>{
              if(author.id === currentUser.id || deleteable){
                this.handleComment.bind(this, comment.id)();
              }
            }}
            >
            <strong>{author.username}</strong>
            <span>{comment.body}</span>
          </li>
          <div className={`comment-dropdown ${deleteable_status}`}>
            <button onClick={this.handleDeleteComment.bind(this, comment.id)}>Delete</button>
          </div>
        </ul>
      )
    })
    return (
      <div className="post-top-comment">
        <ul className="post-top">
          <div className="post-author-img" onClick={this.handleAuthorClick.bind(this)}>
            <img src={this.props.user.photo_image_url} />
          </div>
          <div className="post-author-name">
            <p>{this.props.user.username}</p>
          </div>
        </ul>
        <ul className="post-item-box">
          <img src={this.props.post.photo_image_url} />
        </ul>
        <ul className="comment">
          <div className="comment-icons">
            <a className="comment-like" onClick={this.handleLike.bind(this)}><img src={this.props.liked ? window.redlikeImg : window.likeImg}/></a>
            <a className="comment-write" onClick={this.handleCommentImg.bind(this, this.props.post)}><img src={window.commentImg}/></a>

          </div>
          <div className="likes-count">{this.props.post.likes.length} likes</div>
          <div className="comment-content">
            {items}
            <li>
              <form onSubmit={this.handleSubmitComment.bind(this)}>
                <input
                   onFocus={this.onFocus.bind(this)}
                   onBlur={this.onBlur.bind(this)}
                   style={{width: this.state.length}}
                   className={`comment-input-bar-${this.props.post.id}`}
                   required type='text' value={this.state.commentValue}
                   onChange={this.updateComment.bind(this)}
                   placeholder={this.state.placeholder}
                   />
                <input type='submit' hidden />
              </form>
              <p className='error-messages'>{this.props.errors}</p>
            </li>
          </div>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return{
    status: state.ui.comment_dropdown,
    currentUser: state.entities.users[state.session.currentUserId],
    errors: state.errors.commentForm,
    users: state.entities.users,
    user: state.entities.users[ownProps.post.posterId],
    liked: ownProps.post.likes.includes(state.session.currentUserId),
    comments: Object.values(ownProps.post.comments),
    deleteable: ownProps.post.posterId === state.session.currentUserId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openCommentDropdown: () => dispatch(openCommentDropdown()),
    closeCommentDropdown: () => dispatch(closeCommentDropdown()),
    createLike: (post_id) => dispatch(createLike(post_id)),
    deleteLike: (post_id) => dispatch(deleteLike(post_id)),
    createComment: (comment) => dispatch(createComment(comment)),
    deleteComment: (id) => dispatch(deleteComment(id)),
    remove_error: ()=> dispatch({type: `REMOVE_ERROR`})
  }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PostItem));
