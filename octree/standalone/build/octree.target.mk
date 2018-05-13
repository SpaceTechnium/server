# This file is generated by gyp; do not edit.

TOOLSET := target
TARGET := octree
DEFS_Debug := \
	'-DNODE_GYP_MODULE_NAME=octree' \
	'-DUSING_UV_SHARED=1' \
	'-DUSING_V8_SHARED=1' \
	'-DV8_DEPRECATION_WARNINGS=1' \
	'-D_LARGEFILE_SOURCE' \
	'-D_FILE_OFFSET_BITS=64' \
	'-DDEBUG' \
	'-D_DEBUG' \
	'-DV8_ENABLE_CHECKS'

# Flags passed to all source files.
CFLAGS_Debug := \
	-fPIC \
	-pthread \
	-Wall \
	-Wextra \
	-Wno-unused-parameter \
	-m64 \
	-g \
	-O0

# Flags passed to only C files.
CFLAGS_C_Debug :=

# Flags passed to only C++ files.
CFLAGS_CC_Debug := \
	-fno-rtti \
	-std=gnu++0x

INCS_Debug := \
	-I/home/pmsilva1/.node-gyp/8.11.1/include/node \
	-I/home/pmsilva1/.node-gyp/8.11.1/src \
	-I/home/pmsilva1/.node-gyp/8.11.1/deps/uv/include \
	-I/home/pmsilva1/.node-gyp/8.11.1/deps/v8/include \
	-I$(srcdir)/..

DEFS_Release := \
	'-DNODE_GYP_MODULE_NAME=octree' \
	'-DUSING_UV_SHARED=1' \
	'-DUSING_V8_SHARED=1' \
	'-DV8_DEPRECATION_WARNINGS=1' \
	'-D_LARGEFILE_SOURCE' \
	'-D_FILE_OFFSET_BITS=64'

# Flags passed to all source files.
CFLAGS_Release := \
	-fPIC \
	-pthread \
	-Wall \
	-Wextra \
	-Wno-unused-parameter \
	-m64 \
	-O3 \
	-fno-omit-frame-pointer

# Flags passed to only C files.
CFLAGS_C_Release :=

# Flags passed to only C++ files.
CFLAGS_CC_Release := \
	-fno-rtti \
	-std=gnu++0x

INCS_Release := \
	-I/home/pmsilva1/.node-gyp/8.11.1/include/node \
	-I/home/pmsilva1/.node-gyp/8.11.1/src \
	-I/home/pmsilva1/.node-gyp/8.11.1/deps/uv/include \
	-I/home/pmsilva1/.node-gyp/8.11.1/deps/v8/include \
	-I$(srcdir)/..

OBJS := \
	$(obj).target/$(TARGET)/../demo.o \
	$(obj).target/$(TARGET)/test.o

# Add to the list of files we specially track dependencies for.
all_deps += $(OBJS)

# CFLAGS et al overrides must be target-local.
# See "Target-specific Variable Values" in the GNU Make manual.
$(OBJS): TOOLSET := $(TOOLSET)
$(OBJS): GYP_CFLAGS := $(DEFS_$(BUILDTYPE)) $(INCS_$(BUILDTYPE))  $(CFLAGS_$(BUILDTYPE)) $(CFLAGS_C_$(BUILDTYPE))
$(OBJS): GYP_CXXFLAGS := $(DEFS_$(BUILDTYPE)) $(INCS_$(BUILDTYPE))  $(CFLAGS_$(BUILDTYPE)) $(CFLAGS_CC_$(BUILDTYPE))

# Suffix rules, putting all outputs into $(obj).

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(srcdir)/%.cpp FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

# Try building from generated source, too.

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(obj).$(TOOLSET)/%.cpp FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(obj)/%.cpp FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

# End of this set of suffix rules
### Rules for final target.
LDFLAGS_Debug := \
	-pthread \
	-rdynamic \
	-m64

LDFLAGS_Release := \
	-pthread \
	-rdynamic \
	-m64

LIBS :=

$(builddir)/octree: GYP_LDFLAGS := $(LDFLAGS_$(BUILDTYPE))
$(builddir)/octree: LIBS := $(LIBS)
$(builddir)/octree: LD_INPUTS := $(OBJS)
$(builddir)/octree: TOOLSET := $(TOOLSET)
$(builddir)/octree: $(OBJS) FORCE_DO_CMD
	$(call do_cmd,link)

all_deps += $(builddir)/octree
# Add target alias
.PHONY: octree
octree: $(builddir)/octree

# Add executable to "all" target.
.PHONY: all
all: $(builddir)/octree

