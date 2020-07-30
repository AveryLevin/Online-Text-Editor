from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404, JsonResponse
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .models import User, UserAccount
from projects.models import Project
# Create your views here.


# === UTILITIES ===

def get_user_or_None(request):
    if request.user.is_authenticated and request.user.is_active:
        return request.user.useraccount
    else:
        return None


def get_user_projs(user):
    projs = []
    if user:
        for proj in user.owned_projects.all():
            projs.append(proj)
    return projs

def format_months(mo_num_string):
    mo_dict = {
        "01": "Jan",
        "02": "Feb",
        "03": "Mar",
        "04": "Apr",
        "05": "May",
        "06": "Jun",
        "07": "Jul",
        "08": "Aug",
        "09": "Sep",
        "10": "Oct",
        "11": "Nov",
        "12": "Dec",
    }

    return mo_dict[mo_num_string]

def put_projs_in_json_format(projs):
    projs_json = []
    for proj in projs:
        projs_json.append(
            {
                'name': proj.name,
                'createDate': format_months(proj.start_date.strftime("%m")) + proj.start_date.strftime(" %d, %Y"),
                'lastEditDate': format_months(proj.start_date.strftime("%m")) + proj.start_date.strftime(" %d, %Y"),
            }
        )
    return projs_json


# === VIEWS ===
@login_required()
def user_home(request):

    user = get_user_or_None(request)

    if user:
        context = {
            'logged_in': True,
            'user': user,
            'projects': put_projs_in_json_format(get_user_projs(user)),
        }
        
        return render(request, 'accounts/user_home.html', context)
    else:
        return render(request, 'page_not_found.html')


def user_login(request):
    # if is post method check for relevant data
    if request.method == 'POST':
        # get username and password.
        # use the POST.get method so it returns None
        # instead of erroring if field left empty
        username = request.POST.get('username')
        password = request.POST.get('password')

        # check whether user exists in DB
        user = authenticate(username=username, password=password)
        # will return None if doesn't exist

        if user:
            if user.is_active:
                # valid and active
                login(request, user)
                return HttpResponseRedirect(reverse('account:user_home'))
            else:
                return HttpResponse("This account has been disabled.")
        else:
            print("Invalid login credentials: {0}, ***".format(username))
            return HttpResponse("Invalid login details supplied")
    else:
        if request.user != None and request.user.is_authenticated and request.user.is_active:
            return HttpResponseRedirect(reverse('account:user_home'))
        context = {}
        return render(request, 'accounts/user_login.html', context)


@login_required()
def user_logout(request):
    logout(request)
    return HttpResponseRedirect(reverse('welcome'))


def user_create(request):

    user = get_user_or_None(request)

    if user:
        context = {
            'logged_in': True,
            'user': user
        }
        return render(request, 'accounts/user_home.html', context)
    else:
        context = {
            'logged_in': False,
            'user': user
        }
        return render(request, 'accounts/user_create.html', context)


def user_pref(request):
    context = {}
    return render(request, 'page_not_found.html', context)
