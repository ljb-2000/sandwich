/**
 * Created by zhangxiaoyu on 2017/7/4.
 */

angular.module('groupList').component('groupList', {
    templateUrl: '/static/app/account/group-list/group-list.template.html',
    controller: ['$http', 'Toastr', function ($http, Toastr) {
        var self = this;
        this.loading = false;
        this.get_data = function () {
            self.loading = true;
            $http.get('/api/group/list/').then(function (response) {
                self.groups = response.data.data;
                self.loading = false;
                // self.show_permissions(self.groups[0]);
            }, function (response) {
                // 获取数据失败执行
                Toastr.handle(response, "获取用户组列表");
                self.loading = false;
            });
        };
        this.get_data();
        this.init_create_form_data = function (form) {
            self.create_form_data = {
                "name": ""
            };
            form.name.$dirty = false;
            form.name.$pristine = true;
        };
        this.create_group = function (form) {
            if (!form.$invalid) {
                var postCfg = {
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (data) {
                        return $.param(data);
                    }
                };
                var request_data = self.create_form_data;
                self.loading = true;
                $http.post("/api/group/create/", request_data, postCfg)
                    .then(function (response) {
                        self.loading = false
                        Toastr.messager["success"]("创建用户组成功", "成功");
                        self.get_data();
                        $('#create-modal').modal('hide');
                    }, function (response) {
                        self.loading = false;
                        Toastr.handle(response, "创建用户组");
                    });
            }
        };
        this.init_change_form_data = function (form, group) {
            self.change_form_data = {
                "id": group.id,
                "name": group.name
            };
            form.new_name.$dirty = false;
            form.new_name.$pristine = true;
        };
        this.edit_group = function (form) {
            if (!form.$invalid) {
                var postCfg = {
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (data) {
                        return $.param(data);
                    }
                };
                var request_data = self.change_form_data;
                self.loading = true;
                $http.post("/api/group/change/", request_data, postCfg)
                    .then(function (response) {
                        self.loading = false
                        Toastr.messager["success"]("编辑用户组成功", "成功");
                        self.get_data();
                        $('#change-modal').modal('hide');
                    }, function (response) {
                        self.loading = false;
                        Toastr.handle(response, "编辑用户组");
                    });
            }

        };
        this.delete_group = function (group_id) {
            swal({
                title: "确认删除",
                text: "确认要删除该用户组吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认删除",
                cancelButtonText: "取消",
                closeOnConfirm: true,
                closeOnCancel: true
            }, function (isConfirm) {
                if (isConfirm) {
                    var postCfg = {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function (data) {
                            return $.param(data);
                        }
                    };
                    var request_data = {'id': group_id};
                    self.loading = true;
                    $http.post("/api/group/delete/", request_data, postCfg)
                        .then(function (response) {
                            self.get_data();
                            self.loading = false;
                            Toastr.messager["success"]("删除用户组成功", "成功");
                        }, function (response) {
                            self.loading = false;
                            Toastr.handle(response, "删除用户组");
                        });
                }
            });
        };
        this.show_permissions = function (group) {
            // angular.copy(group.permissions, this.permissions);
            this.current_group_id = group.id
            this.permissions = angular.copy(group.permissions)
        };
        this.change_permissions = function () {
            var request_data = {'id': this.current_group_id, "permissions": JSON.stringify(this.permissions)};
            self.loading = true;
            var postCfg = {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (data) {
                    return $.param(data);
                }
            };
            $http.post("/api/group/change_permissions/", request_data, postCfg)
                .then(function (response) {
                    self.get_data();
                    self.loading = false;
                    Toastr.messager["success"]("更新用户组权限成功", "成功");
                }, function (response) {
                    self.loading = false;
                    Toastr.handle(response, "更新用户组权限");
                });
        };
        // this.show_permissions(this.groups[0])
    }]
});
