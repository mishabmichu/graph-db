const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');

const app = express();

const typeDefs = gql`
  type Recipe {
    id: ID!
    title: String!
    description: String!
    ingredients: [String!]!
  }

  type Query {
    recipes: [Recipe!]
  }

  type Mutation {
    createRecipe(
      title: String!
      description: String!
      ingredients: [String!]!
    ): Recipe!
  }
`;

const resolvers = {
  Query: {
    recipes: async () => {
      return await Recipe.find();
    },
  },
  Mutation: {
    createRecipe: async (_, { title, description, ingredients }) => {
      const newRecipe = new Recipe({ title, description, ingredients });
      await newRecipe.save();
      return newRecipe;
    },
  },
};

mongoose.connect(
  'mongodb+srv://mishab:admin@cluster0.wkbpt53.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

const recipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  ingredients: [String],
});

const Recipe = mongoose.model('Recipe', recipeSchema);

const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(res => {
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
});
