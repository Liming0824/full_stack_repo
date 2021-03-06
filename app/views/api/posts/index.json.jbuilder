json.posts do
  @posts.each do |post|
    json.set! post.id do
      json.partial! 'api/posts/post', post: post
    end
  end
end

json.users do
  @users.each do |user|
    json.set! user.id do
      json.extract! user, :id, :username, :user_img_url, :bio
      json.photo_image_url url_for(user.user_photo)
      json.follower_records user.follower_records.each do |follow|
          json.extract! follow, :noticed, :follower_id
      end

      json.posts user.posts.each do |post|
        json.partial! 'api/posts/post', post: post
      end

      json.followers user.followers.each do |follower|
        json.extract! follower, :id, :username, :bio
        json.photo_image_url url_for(follower.user_photo)
      end

      json.followings user.followings.each do |following|
        json.extract! following, :id, :username, :bio
        json.photo_image_url url_for(following.user_photo)

        json.posts following.posts.each do |post|
          json.extract! post, :id, :image_url, :created_at
        end

      end
    end
  end
end
