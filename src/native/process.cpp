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

      HANDLE hProcess = OpenProcess(PROCESS_ALL_ACCESS, FALSE, aProcesses[i]);

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

        CloseHandle(hProcess);
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
  size_t argc = 3;
  napi_value args[3];
  napi_get_cb_info(env, info, &argc, args, NULL, NULL);

  int pid;
  int64_t addr;
  int size;
  napi_status status = napi_get_value_int32(env, args[0], &pid);
  if (status != napi_ok)
    return NULL;

  status = napi_get_value_int64(env, args[1], &addr);
  if (status != napi_ok)
    return NULL;

  status = napi_get_value_int32(env, args[2], &size);
  if (status != napi_ok)
    return NULL;

  HANDLE hProcess = OpenProcess(PROCESS_ALL_ACCESS, FALSE, pid);

  unsigned int *buf = (unsigned int *)calloc(size, sizeof(unsigned int));

  ReadProcessMemory(hProcess, (LPCVOID)addr, buf, sizeof(unsigned int) * size, NULL);

  status = napi_generic_failure;
  napi_value arr, value;
  status = napi_create_array_with_length(env, size, &arr);
  if (status != napi_ok)
    return NULL;

  for (int i = 0; i < size; i++)
  {
    status = napi_create_int64(env, buf[i], &value);
    if (status != napi_ok)
      return NULL;

    status = napi_set_element(env, arr, i, value);
    if (status != napi_ok)
      return NULL;
  }

  free(buf);

  CloseHandle(hProcess);

  return arr;
}

static napi_value WriteMemory(napi_env env, napi_callback_info info)
{
  return NULL;
}

static napi_value Init(napi_env env, napi_value exports)
{
  napi_status status;
  napi_property_descriptor desc[] = {
      {"getList", NULL, GetList, NULL, NULL, NULL, napi_default, NULL},
      {"readMemory", NULL, ReadMemory, NULL, NULL, NULL, napi_default, NULL},
      {"writeMemory", NULL, WriteMemory, NULL, NULL, NULL, napi_default, NULL}};
  status = napi_define_properties(env, exports, 3, desc);
  assert(status == napi_ok);
  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init);