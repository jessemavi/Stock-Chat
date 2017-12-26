// unction that takes  resolver and creates another resolver
const createResolver = (resolver) => {
  const baseResolver = resolver;
  baseResolver.createResolver = (childResolver) => {
    const newResolver = async (parent, args, context, info) => {
      await resolver(parent, args, context, info)
      return childResolver(parent, args, context, info);
    };
    return createResolver(newResolver);
  };
  return baseResolver;
};

// requiresAuth
// invokes createResolver and takes in a resolver
const requiresAuth = createResolver((parent, args, { user }) => {
  console.log('args in requiresAuth', args);
  console.log('user in requiresAuth', user);
  if(!user) {
    throw new Error('Not authenticated');
  }
});

module.exports = requiresAuth;