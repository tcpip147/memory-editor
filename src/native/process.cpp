#include <assert.h>
#include <node_api.h>

#include <windows.h>
#include <stdio.h>
#include <tchar.h>
#include <psapi.h>

void GetProcessList(napi_env env, napi_value arr)
{
  DWORD aProcesses[1024], cbNeeded, cProcesses;
  unsigned int i, j;
  napi_status status = napi_generic_failure;
  napi_value obj, value, string;

  if (!EnumProcesses(aProcesses, sizeof(aProcesses), &cbNeeded))
  {
    return;
  }

  cProcesses = cbNeeded / sizeof(DWORD);

  for (i = 0, j = 0; i < cProcesses; i++)
  {
    if (aProcesses[i] != 0)
    {
      TCHAR szProcessName[MAX_PATH] = TEXT("<unknown>");

      HANDLE hProcess = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, FALSE, aProcesses[i]);

      if (NULL != hProcess)
      {
        HMODULE hMod;
        DWORD cbNeeded;

        if (EnumProcessModules(hProcess, &hMod, sizeof(hMod), &cbNeeded))
        {
          GetModuleBaseName(hProcess, hMod, szProcessName, sizeof(szProcessName) / sizeof(TCHAR));
        }

        status = napi_create_object(env, &obj);
        if (status != napi_ok)
          return;

        status = napi_create_int32(env, aProcesses[i], &value);
        if (status != napi_ok)
          return;

        status = napi_set_named_property(env, obj, "pid", value);
        if (status != napi_ok)
          return;

        status = napi_create_string_utf8(env, szProcessName, NAPI_AUTO_LENGTH, &string);
        if (status != napi_ok)
          return;

        status = napi_set_named_property(env, obj, "name", string);
        if (status != napi_ok)
          return;

        status = napi_set_element(env, arr, j++, obj);
        if (status != napi_ok)
          return;
      }
    }
  }
}

static napi_value GetList(napi_env env, napi_callback_info info)
{
  napi_status status = napi_generic_failure;
  napi_value arr;
  status = napi_create_array(env, &arr);
  if (status != napi_ok)
    return NULL;

  GetProcessList(env, arr);

  return arr;
}

static napi_value ReadMemory(napi_env env, napi_callback_info info)
{
  size_t argc = 1;
  napi_value args[1];
  napi_get_cb_info(env, info, &argc, args, NULL, NULL);

  napi_value pid = args[0];

  napi_status status = napi_generic_failure;
  napi_value arr;
  status = napi_create_array(env, &arr);
  if (status != napi_ok)
    return NULL;

  return pid;
}

static napi_value Init(napi_env env, napi_value exports)
{
  napi_status status;
  napi_property_descriptor desc[] = {
      {"getList", NULL, GetList, NULL, NULL, NULL, napi_default, NULL},
      {"readMemory", NULL, ReadMemory, NULL, NULL, NULL, napi_default, NULL}};
  status = napi_define_properties(env, exports, 2, desc);
  assert(status == napi_ok);
  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)