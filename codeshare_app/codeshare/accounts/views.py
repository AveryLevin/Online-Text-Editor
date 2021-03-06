from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404, JsonResponse
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .models import User, UserAccount
from .forms import UserForm, UserAccountForm
from projects.models import Project
from codeshare.utils import put_in_json_format

import json

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


def get_contributers(proj):
    return proj.accessors.all()


def get_affiliated_users(user):
    affiliated_users = []
    for proj in get_user_projs(user):
        affiliated_users.extend(get_contributers(proj))

    r_val = []

    for user in affiliated_users:
        if user not in r_val:
            r_val.append(user)
    return r_val

# === VIEWS ===


@login_required()
def user_home(request):

    user = get_user_or_None(request)

    if user:

        if request.method == 'POST':
            data = request.body
            if data:
                data = json.loads(data)
                action = data.get('action')
                if action == 'create_proj':
                    proj_name = data.get('name')
                    new_proj = Project(name=proj_name, owner=user)
                    new_proj.save()
                    proj_id = new_proj.id
                    return HttpResponseRedirect(reverse('projects:project_home', kwargs={'proj_id': proj_id}))
        else:
            context = {
                'logged_in': True,
                'user': user,
                'projects': put_in_json_format(get_user_projs(user), 'projects'),
                'affiliated_users': put_in_json_format(get_affiliated_users(user), 'users'),
            }
            if 'file_context' in request.session:
                del request.session['file_context']
                print("deleted current project session")
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
        return user_home(request)
    else:
        # gives status of registration
        registered = False

        username = None
        # if user is posting data, check forms for info
        if request.method == 'POST':
            # read raw data from forms
            user_form = UserForm(data=request.POST)
            account_form = UserAccountForm(data=request.POST)

            # check if forms are valid
            if user_form.is_valid() and account_form.is_valid():
                # save data to database
                user = user_form.save()

                # hash password
                user.set_password(user.password)
                # update saved user
                user.save()

                # create a UserProfile instance.
                # Don't commit to DB yet to add attributes
                profile = account_form.save(commit=False)
                profile.user = user

                # now save profile
                profile.save()

                # save username for redir
                username = user.username

                # update state var
                registered = True

                #login user
                login(request, user)
                return HttpResponseRedirect(reverse('account:user_home'))
            else:
                # dump error log
                print(user_form.errors, account_form.errors)
        
        else:
            # Not a POST method.
            # render the form using two ModelForm instances
            user_form = UserForm()
            account_form = UserAccountForm()

            context = {
                'logged_in': False,
                'user_form': user_form,
                'account_form': account_form,
            }
            return render(request, 'accounts/user_create.html', context)


def user_pref(request):
    context = {}
    return render(request, 'page_not_found.html', context)
