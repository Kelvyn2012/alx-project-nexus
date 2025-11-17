import graphene
from schema import Query as FeedQuery, Mutation as FeedMutation


class Query(FeedQuery, graphene.ObjectType):
    # inherit queries from feed
    pass


class Mutation(FeedMutation, graphene.ObjectType):
    # inherit mutations from feed
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
