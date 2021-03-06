const { GraphQLServer, PubSub } = require('graphql-yoga')

// 1
let persons = [{
        id: 1,
        firstName: 'Michael',
        lastName: 'Suyama',
        email: 'suyama@wp.co',
        likedPosts:[1,2]
      },
      {
        id: 2,
        firstName: 'Nancy',
        lastName: 'DaVolio',
        email: 'davolio@wp.co',
        likedPosts: [1]
      },
      {
        id: 3,
        firstName: 'David',
        lastName: 'Buchanan',
        email: 'buchanan@wp.co',
        likedPosts: [2,3]
      },
]

let postlist = [{
        id: 1,
        description: 'Introduction to GraphQL',
        imageUrl: 'google.com'
      },
      {
        id: 2,
        description: 'Welcome to POC',
        imageUrl: 'microsoft.com'
      },
      {
        id: 3,
        description: 'Advanced GraphQL',
        imageUrl: 'yahoo.com'
    },
]

const pubsub = new PubSub()

// 2
const resolvers = {
    Query: {
        hello: () => `Hello world!`,
        people: () => persons,
        person: (_, args) => persons[args.id-1],
        post: (_, args) => postlist[args.id-1],
        posts: (_, args) => {
            if(args.filter != null){
                return postlist.filter(desc => desc.description == args.filter)
            } else {
                return postlist
            }
        }
    },
    Mutation: {
        createPost: (parent, args) => {
            let postcount = postlist.length + 1
            const post = {
                id: postcount++,
                description: args.description,
                imageUrl: args.imageUrl,
            }
            postlist.push(post)
            pubsub.publish('test', { newPost: post })
            return post
        },
        deletePost: (parent, args) => {
            let post
            let x = postlist.findIndex(id => id.id == args.id)
            while (x != -1){
                post = {
                    id: postlist[x].id,
                    description: postlist[x].description,
                    imageUrl: postlist[x].imageUrl,
                }
                postlist.splice(x,1)
                x = postlist.findIndex(id => id.id == args.id)
            }
            return post
        }
    },
    Subscription: {
        newPost: {
            subscribe: () => pubsub.asyncIterator('test'),
        }
    },
    Person: {
        id: (parent) => parent.id,
        firstName: (parent) => parent.firstName,
        lastName: (parent) => parent.lastName,
        fullName: (parent) => parent.firstName + " " + parent.lastName,
        email: (parent) => parent.email,
        likedPosts: (parent) => {
            let likedPost = []
            let post
            // parent.likedPosts.array.forEach(element => {
            //     let x = postlist.findIndex(id => id.id == element)
            //     post =  {
            //         id: postlist[x].id,
            //         description: postlist[x].description,
            //         imageUrl: postlist[x].imageUrl,
            //     }
            //     likedPost.push(post)
            // });
            for (let i=0; i < parent.likedPosts.length; i++){
                let x = postlist.findIndex(id => id.id == parent.likedPosts[i])
                post =  {
                    id: postlist[x].id,
                    description: postlist[x].description,
                    imageUrl: postlist[x].imageUrl,
                }
                likedPost.push(post)
            }
            return likedPost
            },
    },
    Post: {
        id: (parent) => parent.id,
        description: (parent) => parent.description,
        imageUrl: (parent) => parent.imageUrl,
    }
}

// 3
const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
})
server.start(() => console.log(`Server is running on http://localhost:4000`))   