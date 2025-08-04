class RemoveXFrameOptionsMiddleware:
    """
    Remove 'X-Frame-Options' de respostas para arquivos PDF em /media/
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Ajuste conforme necessário
        if request.path.startswith('/media/') and request.path.endswith('.pdf'):
            if 'X-Frame-Options' in response:
                del response['X-Frame-Options']

        return response
