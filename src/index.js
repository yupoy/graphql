const { GraphQLServer } = require('graphql-yoga')

// 1
let persons = [{
        id: '1',
        firstName: 'Michael',
        lastName: 'Suyama',
        fullName: 'Michael Suyama',
        email: 'suyama@wp.co'
      },
      {
        id: '2',
        firstName: 'Nancy',
        lastName: 'DaVolio',
        fullName: 'Nancy DaVolio',
        email: 'davolio@wp.co'
      },
      {
        id: '3',
        firstName: 'David',
        lastName: 'Buchanan',
        fullName: 'David Buchanan',
        email: 'buchanan@wp.co'
      },
]

let postlist = [{
        id: '1',
        description: 'Introduction to GraphQL',
        imageUrl: 'google.com'
      },
      {
        id: '2',
        description: 'Welcome to POC',
        imageUrl: 'microsoft.com'
      },
      {
        id: '3',
        description: 'Advanced GraphQL',
        imageUrl: 'yahoo.com'
    },
]

let postcount = postlist.length + 1

// 2
const resolvers = {
    Query: {
        hello: () => `Hello world!`,
        people: () => persons,
        person: (_, args) => persons[args.id-1],
        post: (_, args) => postlist[args.id-1],
        posts: (_, args) => {
            if(args.filter != null){
                return postlist
            } else {
                return postlist
            }
        }
    },
    Mutation: {
        createPost: (parent, args) => {
            const post = {
                id: postcount++,
                description: args.description,
                imageUrl: args.imageUrl,
            }
            postlist.push(post)
            return post
        },
        // deletePost: (parent, args) => {
        // }
    },
    Person: {
        id: (parent) => parent.id,
        firstName: (parent) => parent.firstName,
        lastName: (parent) => parent.lastName,
        fullName: (parent) => parent.fullName,
        email: (parent) => parent.email,
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