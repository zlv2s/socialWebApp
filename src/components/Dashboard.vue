<template>
  <div class="dashboard">
    <section>
      <div class="col1">
        <div class="profile">
          <h5>{{userProfile.name}}</h5>
          <p>{{userProfile.title}}</p>
          <div class="create-post">
            <p>create a post</p>
            <form @submit.prevent>
              <textarea v-model.trim="post.content"></textarea>
              <button :disabled="post.content===''" @click="createPost" class="button">post</button>
            </form>
          </div>
        </div>
      </div>

      <div class="col2">
        <transition name="fade">
          <div @click="showNewPosts" class="hidden-posts" v-if="hiddenPosts.length">
            <p>
              Click to show
              <span class="new-posts">{{ hiddenPosts.length }}</span>
              new
              <span v-if="hiddenPosts.length > 1">posts</span>
              <span v-else>post</span>
            </p>
          </div>
        </transition>
        <div v-if="posts.length">
          <div :key="post.id" class="post" v-for="post in posts">
            <h5>{{ post.userName }}</h5>
            <span>{{ post.createdOn | formatDate }}</span>
            <p>{{ post.content | trimLength }}</p>
            <ul>
              <li>
                <a @click="openCommentModal(post)">comments {{ post.comments }}</a>
              </li>
              <li>
                <a @click="likePost(post.id, post.likes)">likes {{ post.likes }}</a>
              </li>
              <li>
                <a @click="viewPost(post)">view full post</a>
              </li>
            </ul>
          </div>
        </div>
        <div v-else>
          <p class="no-results">There are currently no posts</p>
        </div>
      </div>
    </section>

    <!-- comment modal -->
    <transition name="fade">
      <div class="c-modal" v-if="showCommentModal">
        <div class="c-container">
          <a @click="closeCommentModal">X</a>
          <p>add a comment</p>
          <form @submit.prevent>
            <textarea v-model.trim="comment.content"></textarea>
            <button :disabled="comment.content == ''" @click="addComment" class="button">add comment</button>
          </form>
        </div>
      </div>
    </transition>

    <!-- post modal -->
    <transition name="fade">
      <div class="p-modal" v-if="showPostModal">
        <div class="p-container">
          <a @click="closePostModal" class="close">X</a>
          <div class="post">
            <h5>{{ fullPost.userName }}</h5>
            <span>{{ fullPost.createdOn | formatDate }}</span>
            <p>{{ fullPost.content }}</p>
            <ul>
              <li>
                <a>comments {{ fullPost.comments }}</a>
              </li>
              <li>
                <a>likes {{ fullPost.likes }}</a>
              </li>
            </ul>
          </div>
          <div class="comments" v-show="postComments.length">
            <div :key="i" class="comment" v-for="(comment,i) in postComments">
              <p>{{ comment.userName }}</p>
              <span>{{ comment.createdOn | formatDate }}</span>
              <p>{{ comment.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
const fb = require('../firebaseConfig.js')
export default {
  data() {
    return {
      post: {
        content: ''
      },
      comment: {
        postId: '',
        userId: '',
        content: '',
        postComments: 0
      },
      fullPost: {},
      showCommentModal: false,
      showPostModal: false,
      postComments: []
    }
  },
  computed: {
    ...mapState(['userProfile', 'currentUser', 'posts', 'hiddenPosts'])
  },
  methods: {
    viewPost(post) {
      fb.commentsCollection
        .where('postId', '==', post.id)
        .get()
        .then(docs => {
          let commentsArray = []

          docs.forEach(doc => {
            let comment = doc.data()
            comment.id = doc.id
            commentsArray.push(comment)
          })

          this.postComments = commentsArray
          this.fullPost = post
          this.showPostModal = true
        })
        .catch(err => {
          console.log(err)
        })
    },
    closePostModal() {
      this.postComments = []
      this.showPostModal = false
    },
    likePost(postId, postLikes) {
      let docId = `${this.currentUser.uid}_${postId}`
      fb.likesCollection
        .doc(docId)
        .get()
        .then(doc => {
          console.log(doc)
          if (doc.exists) {
            console.log('here')
            return
          }
          fb.likesCollection
            .doc(docId)
            .set({
              postId,
              userId: this.currentUser.uid
            })
            .then(() => {
              fb.postsCollection.doc(postId).update({
                likes: postLikes + 1
              })
            })
        })
        .catch(err => {
          console.log(err)
        })
    },
    addComment() {
      let postId = this.comment.postId
      let postComments = this.comment.postComments

      fb.commentsCollection
        .add({
          createdOn: new Date(),
          content: this.comment.content,
          postId: postId,
          userId: this.currentUser.uid,
          userName: this.userProfile.name
        })
        .then(doc => {
          fb.postsCollection
            .doc(postId)
            .update({
              comments: postComments + 1
            })
            .then(() => {
              this.closeCommentModal()
            })
        })
        .catch(err => {
          console.log(err)
        })
    },
    openCommentModal(post) {
      this.comment.postId = post.id
      this.comment.userId = post.userId
      this.comment.postComments = post.comments
      this.showCommentModal = true
    },
    closeCommentModal() {
      this.comment.postId = ''
      this.comment.userId = ''
      this.comment.content = ''
      this.showCommentModal = false
    },
    showNewPosts() {
      let updatePostsArray = this.hiddenPosts.concat(this.posts)
      this.$store.commit('setHiddenPosts', null)
      this.$store.commit('setPosts', updatePostsArray)
    },
    createPost() {
      fb.postsCollection
        .add({
          createdOn: new Date(),
          content: this.post.content,
          userId: this.currentUser.uid,
          username: this.userProfile.name,
          comments: 0,
          likes: 0
        })
        .then(ref => {
          this.post.content = ''
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  filters: {
    formatDate(val) {
      if (!val) {
        return '-'
      }
      let date = val.toDate()
      return moment(date).fromNow()
    },
    trimLength(val) {
      if (val.length < 50) {
        return val
      }
      return `${val.substring(0, 50)}...`
    }
  }
}
</script>

<style lang="scss" scoped>
</style>