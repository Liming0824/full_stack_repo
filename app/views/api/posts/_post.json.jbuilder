json.extract! post, :id, :image_url, :created_at
json.photo_image_url url_for(post.photo)
json.posterId post.user_id
json.likes post.likes.map{|like| like.liker_id}
json.comments post.comments do |comment|
  json.extract! comment, :id, :body, :author_id
  json.author_name comment.author.username
end
