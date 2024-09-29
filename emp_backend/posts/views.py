from posts.models import Post
from .serializers import PostSerializers
from rest_framework.generics import ListAPIView, ListCreateAPIView

class PostApiView(ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializers